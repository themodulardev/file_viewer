import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Footer } from '../shared/footer/footer';
import { Navbar } from '../shared/navbar/navbar';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, Sidebar, Navbar, Footer],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss',
})
export class UserLayout {

}
