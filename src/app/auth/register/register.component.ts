import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
 
  standalone: true,
  imports: [FormsModule],
})
export class RegisterComponent {
  name: string="";
  email: string="";
  password: string="";

  onSubmit() {
    // Handle registration logic here
  }
}
