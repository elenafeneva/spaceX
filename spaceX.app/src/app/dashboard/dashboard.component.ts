import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SpacexService } from '../spacex/spacex.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, 
    RouterLink, 
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
    { name: 'Latest', value: 'latest' },
    { name: 'Upcoming', value: 'upcoming' },
    { name: 'Past', value: 'past' }
  ]
  value: string = 'latest';

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
