import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentService } from '@ss/assessment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-refer-earn',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './refer-earn.component.html',
  styleUrl: './refer-earn.component.scss',
})
export class ReferEarnComponent implements OnInit {
  isRedeemVisible = false;
  referrerId = 'abc123'; // Set this dynamically based on logged-in user
  redeemAmount = 0;
  message = '';
  showRedeem() {
    this.isRedeemVisible = true;
  }
  copyCode(codeElement: HTMLElement): void {
  const code = codeElement.innerText;

  // Create a temporary input to copy the text
  const input = document.createElement('input');
  input.value = code;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);

  // Optional: show success message
  console.log(`${code} copied to clipboard!`);
}

  showRefer() {
    this.isRedeemVisible = false;
  }
  referralLink = '';
  totalBonus = 0;
   userId = localStorage.getItem('userId'); // or get it from user object

  constructor(private assessmentService: AssessmentService,
  ) { } 

  ngOnInit(): void {
this.loadTotalBonus();
  this.generateReferralLink(); 

  }

  loadTotalBonus(): void {
    if (this.userId) {
      this.assessmentService.getTotalBonus(this.userId).subscribe({
        next: (res) => {
          this.totalBonus = res.totalBonus;
          console.log('Total bonus:', this.totalBonus);
        },
        error: (err) => {
          console.error('Error fetching bonus:', err);
        }
      });
    } else {
      console.error('UserId is null or undefined');
    }
  }
  generateReferralLink() {

    if (!this.userId) {
      console.error('UserId  not found in localStorage');
      return;
    }
    this.assessmentService.generateReferralLink(this.userId).subscribe(
      (response) => {
        console.log('Referral link generated', response);
        this.referralLink = response.link;
      },
      (error) => {
        console.error('Error generating referral link', error);
      }
    );
  }

  copyLink() {
    const inputElement = document.createElement('input');
    inputElement.value = this.referralLink;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
    if(this.referralLink) {
    alert('Referral link copied to clipboard!');
    }
  }

 
onRedeemClick() {
  if (this.redeemAmount <= 0) {
    this.message = "Please enter a valid amount.";
    return;
  }
  
  if (this.userId) {
    this.assessmentService.redeemPoints(this.userId, this.redeemAmount).subscribe({
      next: (response) => {
        this.message = response.message;
        this.totalBonus = response.currentPoints;
        
        // Simple scroll to bottom
       setTimeout(() => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
}, 0);;
      },
      error: (error) => {
        this.message = error.error?.message || 'Redeem failed.';
      }
    });
  }
}
}
