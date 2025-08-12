import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aptitude-instruction',
  standalone: true,
  imports: [],
  templateUrl: './aptitude-instruction.component.html',
  styleUrl: './aptitude-instruction.component.scss'
})
export class AptitudeInstructionComponent {
  constructor(    private route: ActivatedRoute
  ){}

}
