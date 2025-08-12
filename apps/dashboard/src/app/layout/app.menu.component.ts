import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { NavService } from '@ss/assessment';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any[] = [];

  constructor(
    public layoutService: LayoutService,
    public navService: NavService
  ) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Navigate to',
        items: [
          { label: 'Aptitude', icon: 'pi pi-fw pi-home', routerLink: ['/assessment'], goToType: 'aptitude' },
        ],
      },
    ];
  }
}
