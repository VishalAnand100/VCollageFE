import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '@ss/assessment';
import { ScheduleRequestDto } from 'libs/assessment-lib/src/lib/models/schedule-request.dto';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, CalendarModule, FormsModule],
  templateUrl: './student_dashboard.component.html',
  styleUrls: ['./student_dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private router: Router,
  ) {}

date: Date = new Date(new Date().setDate(new Date().getDate() + 1)); // Default selected = tomorrow
  availableSlots: any[] = [];

  selectedSlot: string | null = null;
       userId = localStorage.getItem('userId');

  // allSlots = [
  //   { time: '11AM-12PM' },
  //   { time: '12PM-1PM' },
  //   { time: '1PM-2PM' },
  //   { time: '2PM-3PM' },
  //   { time: '3PM-4PM' },
  //   { time: '4PM-5PM' },          
  //   { time: '5PM-6PM' },
  //   { time: '6PM-7PM' },
  //   { time: '7PM-8PM' },
  //   { time: '8PM-9PM' },
  //   { time: '9PM-10PM' },
  //       { time: '11PM-12AM' }

  // ];

  currentIndex = 0;
  cardsToShow = 2;
  dashboardData: any;



  id: string | null = null;
  studentId = localStorage.getItem('studentId');
  assessmentId: string | null = null;
  // Responsive logic: detect screen resize and adjust cardsToShow
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateCardsToShow(event.target.innerWidth);
  }
minSelectableDate: Date | undefined;

  ngOnInit() {
  //  const today = new Date();
 this.minSelectableDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
//     this.updateCardsToShow(window.innerWidth); // set initial cardsToShow based on screen width
//   this.availableSlots = this.getAvailableSlots(); // Filter future slots here

    this.fetchSlotsForSelectedDate(this.date);



    this.id = this.route.snapshot.paramMap.get('id');
    if (this.studentId) {
      this.assessmentService.getStudentDashboard(this.studentId).subscribe(data => {
        this.dashboardData = data;
        this.assessmentId = this.dashboardData.assessmentId;
        console.log('Dashboard Data:', this.dashboardData);
      }, error => {
        console.error('Error fetching dashboard data:', error);
      });
    }
  }
// getAvailableSlots(): any[] {
//   const selectedDate = new Date(this.date);
//   const today = new Date();

//   // If selected date is not today, return all slots
//   if (selectedDate.toDateString() !== today.toDateString()) {
//     return this.allSlots;
//   }

//   // If today, filter by current time
//   const currentHour = today.getHours();

//   return this.allSlots.filter(slot => {
//     const match = slot.time.split('-')[0].match(/^(\d{1,2})(AM|PM)$/i);
//     if (!match) return false;

//     let hour = parseInt(match[1], 10);
//     const period = match[2].toUpperCase();

//     if (period === 'PM' && hour !== 12) hour += 12;
//     if (period === 'AM' && hour === 12) hour = 0;

//     return hour > currentHour;
//   });
// }
onDateSelect(selectedDate: Date): void {
  this.date = selectedDate;
  this.fetchSlotsForSelectedDate(this.date);
}

fetchSlotsForSelectedDate(selectedDate: Date): void {
  if (!selectedDate) return;


const year = selectedDate.getFullYear();
const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
const day = String(selectedDate.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;

  this.assessmentService.getAvailableSlots(formattedDate).subscribe({
    next: (response: any) => {
     const rawSlots: string[] = response?.freeSlots || [];
      this.availableSlots = rawSlots.map(time => ({ time })); // 🔧 Convert to expected format

      console.log("Mapped Slots:", this.availableSlots);

      this.selectedSlot = null;
      this.currentIndex = 0;
    },
    error: (err) => {
      console.error('Error fetching slots:', err);
      this.availableSlots = [];
    }
  });
}

getAvailableSlots(): { time: string }[] {
  return this.availableSlots;
}



  selectSlot(time: string): void {
  this.selectedSlot = time;
}

  updateCardsToShow(width: number): void {
    if (width < 500) {
      this.cardsToShow = 2;
    } else if (width >= 500 && width < 768) {
      this.cardsToShow = 2;
    } else if (width >= 768 && width < 1024) {
      this.cardsToShow = 3;
    } else {
      this.cardsToShow = 2;
    }
  }

 get visibleCards() {
  const availableSlots = this.getAvailableSlots();
  return availableSlots.slice(this.currentIndex, this.currentIndex + this.cardsToShow);
}



 slideNext() {
  const nextIndex = this.currentIndex + this.cardsToShow;

  if (nextIndex < this.availableSlots.length) {
    this.currentIndex = nextIndex;
  } else {
    // Reset to start if end is reached
    this.currentIndex = 0;
  }
}
slidePrev() {
  const prevIndex = this.currentIndex - this.cardsToShow;

  if (prevIndex >= 0) {
    this.currentIndex = prevIndex;
  } else {
    // Go to last full page if available
    this.currentIndex = Math.max(
      this.availableSlots.length - this.cardsToShow,
      0
    );
  }
}


  // New: handle slot click
  // selectSlot(slot: string): void {
  //   this.selectedSlot = slot;
  // }

  // New: handle schedule click
  scheduleSession(): void {
  if (!this.date || !this.selectedSlot) {
    alert('Please select a date and time slot');
    return;
  }

  if (!this.studentId) {
    alert('User ID not found. Please log in again.');
    return;
  }

  // Parse start time from selected slot, e.g., "12PM-1PM"
  const timeParts = this.selectedSlot.split('-');
  if (timeParts.length !== 2) {
    alert('Invalid time slot format.');
    return;
  }

  const startTimeStr = timeParts[0]; // "12PM"
  const time24 = this.convertTo24Hour(startTimeStr); // "12:00:00"

 const localDate = new Date(this.date);
  const yyyy = localDate.getFullYear();
  const mm = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(localDate.getDate()).padStart(2, '0');
  const datePart = `${yyyy}-${mm}-${dd}`; // "2025-06-03"  
  
  
  
  const scheduledDate = `${datePart}T${time24}`; // "2025-05-31T12:00:00"

  // Build DTO
  const dto: ScheduleRequestDto = {
    studentId: this.studentId,
    scheduledDate: scheduledDate,
    timeSlot: this.selectedSlot
  };

  // Call service
  this.assessmentService.sendCounsellingSchedule(dto).subscribe({
    next: (res) => {
      alert('Counselling schedule sent successfully!');
          location.reload(); // 🔄 Refreshes the current page

      console.log(res);
    },
    error: (err) => {
      alert('Failed to schedule counselling.');
      console.error(err);
    }
  });
}

convertTo24Hour(timeStr: string): string {
  const match = timeStr.match(/^(\d{1,2})(AM|PM)$/i);
  if (!match) return '00:00:00';

  let hour = parseInt(match[1], 10);
  const period = match[2].toUpperCase();

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const hourStr = hour.toString().padStart(2, '0');
  return `${hourStr}:00:00`;
}

  goToPlanGrow() {
    this.router.navigate(['/assessment/plans-grow', this.id]);
  }

  startAssessment() {
    this.router.navigate([`assessment/${this.studentId}`]);
  }

  showRedeem() {
    this.router.navigate(['/refer-earn']);
  }

  dowwnloadReport() {
    this.router.navigate([`/assessment/detailed-report/${this.assessmentId}`]);
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

