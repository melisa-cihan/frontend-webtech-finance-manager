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
  assetToDeleteId: string | null = null; 
  assetToDelete: Asset | null = null;

  constructor(private bs: BackendService, private router: Router) { }

 
  ngOnInit(): void {
    this.bs.assets$.subscribe((assets) => {
      this.asset = assets;
      this.filteredAssets = [...this.asset]; 
    });

    this.readAll();
    this.search.valueChanges.subscribe((value) => this.filterAssets(value));
  }

  readAll(): void {
    this.bs.getAllAssets().subscribe(
      {
        next: (response) => {
              this.asset = response;
              console.log(this.asset);
              this.filteredAssets = [...this.asset];
            },
        error: (err) => console.log(err),
        complete: () => console.log('getAll() completed')
      })
  }

 
  openDeleteModal(asset: Asset): void {
    this.assetToDelete = asset;
  }


  confirmDelete(): void {
    if (this.assetToDelete){

    this.bs.deleteOneAsset(this.assetToDelete.id).subscribe({
      next: () => {
        this.asset = this.asset.filter(a => a.id !== this.assetToDelete!.id);
        this.filteredAssets = this.filteredAssets.filter(a => a.id !== this.assetToDelete!.id);
        console.log(`Asset "${this.assetToDelete?.asset}" deleted successfully`);
      },
      error: (err) => console.error('Error deleting asset:', err),
      complete: () => console.log('Delete operation completed'),
    });

    this.assetToDelete = null; 
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
        this.formatDate(a.purchase_date).includes(searchTerm)
      );
    }
  }

  
private formatDate(date: any): string {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
}
  
}
