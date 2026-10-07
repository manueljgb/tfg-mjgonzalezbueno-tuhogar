import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private readonly apiUrl = environment.apiUrl + '/users'; // Asegúrate de que esta URL coincida con tu json-server

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}&password=${password}`)
      .pipe(
        map(users => {
          const user = users[0];
          const isValid = !!user;
          this.isAuthenticated.next(isValid);
          if (isValid) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return isValid;
        })
      );
  }

  logout() {
    this.isAuthenticated.next(false);
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): Observable<boolean> {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.isAuthenticated.next(true);
    }
    return this.isAuthenticated.asObservable();
  }
}
