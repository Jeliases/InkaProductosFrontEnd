import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from './producto.service';
import { InventarioService } from './inventario.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  productoForm: FormGroup;
  isEditMode = false;
  productoId!: number;
  categorias: any[] = [];
  uoms: any[] = [{ id: 1, nombre: 'Unidad' }, { id: 2, nombre: 'Caja' }, { id: 3, nombre: 'Kilo' }]; // Lista fija / hardcodeada de momento

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private inventarioService: InventarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      sku: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoriaId: [null, Validators.required],
      uomId: [null, Validators.required],
      precioLista: [0, [Validators.required, Validators.min(0)]],
      stocksSedes: this.fb.array([]) // Array para las cantidades iniciales por sede
    });
  }

  get stocksSedes(): FormArray {
    return this.productoForm.get('stocksSedes') as FormArray;
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productoId = +idParam;
      // Regla Crítica: El SKU no se puede modificar
      this.productoForm.get('sku')?.disable();
    } else {
      // Solo cargamos la lista de almacenes si estamos CREANDO un nuevo producto
      this.cargarAlmacenes();
    }

    // Llamamos a cargar categorías siempre (ya sea para crear o editar)
    this.cargarCategorias();
  }

  cargarAlmacenes() {
    this.inventarioService.getAlmacenes().subscribe(res => {
      const stocksArray = this.productoForm.get('stocksSedes') as FormArray;
      res.forEach(almacen => {
        stocksArray.push(this.fb.group({
          almacenId: [almacen.almacenId || almacen.id],
          nombre: [almacen.nombre],
          cantidad: [0, [Validators.required, Validators.min(0)]]
        }));
      });
    });
  }

  cargarCategorias() {
    this.productoService.getCategorias().subscribe(res => {
      this.categorias = res;
      
      // Es CRÍTICO cargar el producto DESPUÉS de que las categorías ya existen
      // para que Angular pueda autoseleccionar el valor correcto en el desplegable.
      if (this.isEditMode) {
        this.cargarProducto();
      }
    });
  }

  cargarProducto() {
    this.productoService.getProductoById(this.productoId).subscribe(res => {
      
      // 1. Extraer ID de categoría (ya sea de un objeto anidado o buscando por texto)
      let catId = res.categoria?.categoriaId || res.categoria?.id || res.categoriaId;
      if (!catId && typeof res.categoria === 'string') {
        const foundCat = this.categorias.find(c => c.nombre === res.categoria);
        catId = foundCat ? (foundCat.categoriaId || foundCat.id) : null;
      }

      // 2. Extraer ID de la unidad de medida
      let unidadId = res.unidadMedida?.uomId || res.unidadMedida?.id || res.uomId;
      let unidadNombre = res.unidadMedida?.nombre || res.unidadMedida || res.uom;

      if (!unidadId && typeof unidadNombre === 'string') {
        const uomUpper = unidadNombre.toUpperCase();
        const foundUom = this.uoms.find(u => 
          u.nombre.toUpperCase() === uomUpper || 
          (uomUpper === 'UND' && u.nombre === 'Unidad') ||
          (uomUpper === 'CAJ' && u.nombre === 'Caja') ||
          ((uomUpper === 'KG' || uomUpper === 'KGS') && u.nombre === 'Kilo')
        );
        unidadId = foundUom ? foundUom.id : (this.uoms.length + 100);
      }
      
      // Si el ID de unidad existe pero no está en nuestra lista temporal, lo agregamos para que el desplegable lo muestre
      if (unidadId && !this.uoms.find(u => u.id === unidadId)) {
        this.uoms.push({ id: unidadId, nombre: unidadNombre || `Unidad ${unidadId}` });
      }

      this.productoForm.patchValue({
        sku: res.sku,
        nombre: res.nombre,
        descripcion: res.descripcion,
        categoriaId: catId || null,
        uomId: unidadId || null,
        precioLista: res.precioLista
      });
    });
  }

  guardar() {
    this.productoForm.markAllAsTouched(); // Marca todo para mostrar errores si faltan datos
    if (this.productoForm.invalid) return;
    
    // Usamos getRawValue para obtener también los controles deshabilitados como el SKU
    const rawData = this.productoForm.getRawValue(); 

    // Adaptamos el JSON para que coincida exactamente con las relaciones @ManyToOne del Backend
    const payload: any = {
      ...rawData,
      categoria: rawData.categoriaId ? { id: rawData.categoriaId, categoriaId: rawData.categoriaId } : null,
      unidadMedida: rawData.uomId ? { id: rawData.uomId, uomId: rawData.uomId } : null
    };

    // Si es un nuevo producto, adjuntamos el stock inicial por almacén al payload
    if (!this.isEditMode && rawData.stocksSedes?.length > 0) {
      const stockInicial: any = {};
      rawData.stocksSedes.forEach((s: any) => {
        if (s.cantidad > 0) {
          stockInicial[s.almacenId.toString()] = s.cantidad;
        }
      });
      
      // Solo lo enviamos si hay al menos un almacén con stock mayor a 0
      if (Object.keys(stockInicial).length > 0) {
        payload.stockInicial = stockInicial;
      }
    }

    console.log("📦 Payload que se enviará a Spring Boot:", payload);

    const request$ = this.isEditMode 
      ? this.productoService.updateProducto(this.productoId, payload)
      : this.productoService.createProducto(payload);

    request$.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Producto actualizado con éxito' : 'Producto creado con éxito');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        // El interceptor mostrará el error al usuario, pero lo capturamos aquí para evitar errores Uncaught
        console.error("No se pudo guardar el producto", err);
      }
    });
  }
}