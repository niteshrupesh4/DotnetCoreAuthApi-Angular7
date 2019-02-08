import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Exaltuser } from '../_models/exaltuser';
import { ExaltuserService } from '../_services/exaltuser.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class MemberDetailResolver implements Resolve<Exaltuser> {
  constructor(private userService: ExaltuserService,
    private router: Router,
    private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Exaltuser> {
      return this.userService.getUser(route.params['id'])
      .pipe(
        catchError(error => {
          this.alertify.error('Problem retrieving data');
          this.router.navigate(['/members']);
          return of(null);
        })
      );
    }
}
