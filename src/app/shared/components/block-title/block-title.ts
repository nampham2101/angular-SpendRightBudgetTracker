import {Component, input} from '@angular/core';

@Component({
  selector: 'app-block-title',
  imports: [],
  templateUrl: './block-title.html',
  styleUrl: './block-title.css',
})
export class BlockTitle {
  title = input.required()
}
