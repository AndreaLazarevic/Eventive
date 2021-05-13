import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventElementComponent } from './event-element.component';

describe('EventElementComponent', () => {
  let component: EventElementComponent;
  let fixture: ComponentFixture<EventElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventElementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
