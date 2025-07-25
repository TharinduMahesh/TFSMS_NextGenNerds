import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-forbidden",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="forbidden-container">
      <h1>403 - Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <button routerLink="/dashboard" class="back-button">Go to Dashboard</button>
      <button routerLink="/sign-in" class="back-button">Sign In</button>
    </div>
  `,
  styles: [
    `
    .forbidden-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      text-align: center;
      background-color: #f8f8f8;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 20px;
    }

    h1 {
      color: #dc3545;
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    p {
      color: #6c757d;
      font-size: 1.2em;
      margin-bottom: 30px;
    }

    .back-button {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
      margin: 5px;
      transition: background-color 0.3s ease;
    }

    .back-button:hover {
      background-color: #0056b3;
    }
  `,
  ],
})
export class ForbiddenComponent {}
