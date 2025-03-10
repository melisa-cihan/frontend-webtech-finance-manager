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
  
  
  constructor(private bs: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.readAll()
    this.search.valueChanges.subscribe(value => this.filterAssets(value));
  }

  readAll(): void {
    this.bs.getAllAssets().subscribe(
      {
        next: (response) => {
              this.asset = response;
              console.log(this.asset);
              this.filteredAssets = [...this.asset];
              //return this.asset;
            },
        error: (err) => console.log(err),
        complete: () => console.log('getAll() completed')
      })
  }

   // Method to delete an asset
   delete(id: string): void {
    this.bs.deleteOneAsset(id).subscribe({
      next: () => {
        // Filter out the deleted asset from the arrays
        this.asset = this.asset.filter(a => a.id !== id);
        this.filteredAssets = this.filteredAssets.filter(a => a.id !== id);
        console.log(`Asset with id ${id} deleted successfully`);
      },
      error: (err) => {
        console.error('Error deleting asset:', err);
      },
      complete: () => console.log('Delete operation completed')
    });
  }

   // Filter the assets based on the search term
   filterAssets(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredAssets = [...this.asset]; // If the search term is empty, show all assets
    } else {
      searchTerm = searchTerm.toLowerCase(); // Make search term case-insensitive
      this.filteredAssets = this.asset.filter(a => 
        a.asset.toLowerCase().includes(searchTerm) || // Search by asset name
        a.category.toLowerCase().includes(searchTerm) || // Search by category
        a.location.toLowerCase().includes(searchTerm) || // Search by location
        a.purchase_date.toString().toLowerCase().includes(searchTerm) // Search by purchase date
      );
    }
  }
  
}
