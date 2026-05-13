import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTitle } from './block-title';

describe('BlockTitle', () => {
  let component: BlockTitle;
  let fixture: ComponentFixture<BlockTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockTitle],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockTitle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
