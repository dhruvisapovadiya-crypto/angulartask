import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {

  route = inject(ActivatedRoute);

  userId = '';
  historyRequests: any[] = [];

  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    const data = localStorage.getItem('historyRequests');

    if (data) {
      const allHistory = JSON.parse(data);

      this.historyRequests = allHistory.filter(
        (item: any) => item.userId == this.userId
      );
    }
  }

  // History delete function
  cancelHistory(index: number) {

    // direct remove from array
    this.historyRequests.splice(index, 1);

    // updated localStorage save
    localStorage.setItem(
      'historyRequests',
      JSON.stringify(this.historyRequests)
    );

  }

}