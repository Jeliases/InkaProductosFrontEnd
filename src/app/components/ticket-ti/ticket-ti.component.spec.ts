import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTiComponent } from './ticket-ti.component';

describe('TicketTiComponent', () => {
  let component: TicketTiComponent;
  let fixture: ComponentFixture<TicketTiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketTiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketTiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
