import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angulartask');
}

// aama mne evu joi che atyre edit or drop down ma khali 2 state j aave che but jyare edit uuper 
//click kare tyare old email new email ma su change karyo e bhi aavo joi a and pachi dropdown ma aakhi request aave and pachi e approve thai to j changes display and reject thai to changes display na thai and ek sweet alert aave sorry your changes is rejected atyre 
//drop down ma khali state j batave che eni badle aakhi request batave did you understand ?