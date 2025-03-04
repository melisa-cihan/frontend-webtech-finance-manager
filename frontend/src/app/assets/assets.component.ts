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
  search = new FormControl();
  
  constructor(private bs: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.readAll()
  }

  readAll(): void {
    this.bs.getAllAssets().subscribe(
      {
        next: (response) => {
              this.asset = response;
              console.log(this.asset);
              return this.asset;
            },
        error: (err) => console.log(err),
        complete: () => console.log('getAll() completed')
      })
  }
  
}
