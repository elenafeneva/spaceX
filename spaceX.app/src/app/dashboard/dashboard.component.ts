import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SpacexService } from '../spacex/spacex.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    SelectButtonModule,
    FormsModule,
    ButtonModule,
    TableModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardComponent implements OnInit {
  filteredSpaceXData: any[] = [];
  loading = false;
  errorMessage: string | null = null;
  launchTypes = [
    { name: 'Upcoming', value: 'upcoming' },
    { name: 'Latest', value: 'latest' },
    { name: 'Past', value: 'past' }
  ]
  value: string = 'upcoming';

  constructor(
    private authService: AuthService,
    private spacexService: SpacexService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    
  }

  ngOnInit(): void {
    // fetch initial selection
    this.fetchSpaceXData(this.value);
  }

  onLaunchTypeChange(selected: string): void {
    this.value = selected;
    this.fetchSpaceXData(selected);
  }

  fetchSpaceXData(typeOfLaunches: string): void {
    if (!typeOfLaunches) return;  
    this.loading = true;
    this.errorMessage = null;
    this.spacexService.getSpaceXData(typeOfLaunches).subscribe({
      next: (data) => {
        this.loading = false;
        Promise.resolve().then(() => {
          this.filteredSpaceXData = Array.isArray(data) ? data : [];
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.message ?? 'Failed to fetch SpaceX data.';
      },
    });
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/']);
  }
}
