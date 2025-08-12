import { Component ,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans-grow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans-grow.component.html',
  styleUrl: './plans-grow.component.scss',
})
export class PlansGrowComponent implements OnInit {
    constructor(private router: Router) {}

   ngOnInit(): void {
    console.log('Everything is OK');
  }

   

goToPayment(planName: string, price: number) {
    const encodedPrice = btoa(price.toFixed(2)); // Base64 encode the price e.g., "4500.00" → "NDUwMC4wMA=="
    const planId = localStorage.getItem('studentId');; // Replace with actual/dynamic ID if needed

    this.router.navigate([`/assessment/payment/${planId}`], {
      queryParams: {
        price: encodedPrice,
        name: planName
      }
    });
  }
}
