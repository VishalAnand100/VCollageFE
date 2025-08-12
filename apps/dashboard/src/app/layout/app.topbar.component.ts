import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { SharedUiService } from '@ss-shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnDestroy, OnInit {
  showTopbar = true;
  private subscription!: Subscription;
  items!: MenuItem[];
  sharedUiService = inject(SharedUiService);
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
  ) {}
  ngOnInit(): void {
    this.subscription = this.sharedUiService.showTopbar$.subscribe((show) => {
      this.showTopbar = show;
    });
  }
  @Output() menuToggle = new EventEmitter<void>();

  onToggleClick() {
    this.menuToggle.emit();
  }
  logout(){
    localStorage.clear();
    window.location.href = '/login';
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
