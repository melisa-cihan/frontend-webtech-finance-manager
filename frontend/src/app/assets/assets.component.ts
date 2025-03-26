import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Asset } from '../shared/asset';
import { BackendService } from '../shared/backend.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.css'
})
export class AssetsComponent implements OnInit {
  asset!: Asset[];
  filteredAssets!: Asset[];
  search = new FormControl();
  assetToDeleteId: string | null = null; // Store asset ID to delete

  constructor(private bs: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.readAll();
    this.search.valueChanges.subscribe(value => this.filterAssets(value));
  }

  readAll(): void {
    this.bs.getAllAssets().subscribe({
      next: (response) => {
        this.asset = response;
        this.filteredAssets = [...this.asset];
      },
      error: (err) => console.log(err),
      complete: () => console.log('getAll() completed')
    });
  }

  // Open the delete confirmation modal and store the ID
  openDeleteModal(id: string): void {
    this.assetToDeleteId = id;
  }

  // Confirm deletion
  confirmDelete(): void {
    if (this.assetToDeleteId) {
      this.bs.deleteOneAsset(this.assetToDeleteId).subscribe({
        next: () => {
          // Remove asset from arrays
          this.asset = this.asset.filter(a => a.id !== this.assetToDeleteId);
          this.filteredAssets = this.filteredAssets.filter(a => a.id !== this.assetToDeleteId);
          console.log(`Asset with ID ${this.assetToDeleteId} deleted successfully`);
        },
        error: (err) => console.error('Error deleting asset:', err),
        complete: () => console.log('Delete operation completed')
      });
    }
  }

  filterAssets(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredAssets = [...this.asset];
    } else {
      searchTerm = searchTerm.toLowerCase();
      this.filteredAssets = this.asset.filter(a => 
        a.asset.toLowerCase().includes(searchTerm) ||
        a.category.toLowerCase().includes(searchTerm) ||
        a.location.toLowerCase().includes(searchTerm) ||
        a.purchase_date.toString().toLowerCase().includes(searchTerm)
      );
    }
  }
}
