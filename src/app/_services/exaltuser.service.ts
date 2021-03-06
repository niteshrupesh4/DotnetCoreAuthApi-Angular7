import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Exaltuser } from '../_models/exaltuser';
import { HttpClient, HttpParams, } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/Message';


@Injectable({
  providedIn: 'root'
})
export class ExaltuserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(page?, itemPerPage?, userParams?, likeParams?): Observable<PaginatedResult<Exaltuser[]>> {
    const paginatedResult: PaginatedResult<Exaltuser[]> = new PaginatedResult<Exaltuser[]>();

    let params = new HttpParams();

    if (page != null && itemPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likeParams === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likeParams === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this.http.get<Exaltuser[]>(this.baseUrl + 'users', { observe: 'response', params })
    .pipe(
      map(responce => {
        paginatedResult.result = responce.body;
        if (responce.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(responce.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  getUser( id ): Observable<Exaltuser> {
    return this.http.get<Exaltuser>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: Exaltuser) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id );
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }

  getMessages(id: number, page?, itemPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    let params = new HttpParams();

    params = params.append('messageContainer', messageContainer);

    if (page != null && itemPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemPerPage);
    }

    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', { observe: 'response', params })
    .pipe(
      map(responce => {
        paginatedResult.result = responce.body;
        if (responce.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(responce.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );
  }

  getMessageThrad(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }

  markAsRead(userId: number, messageId: number) {
     this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {})
          .subscribe();
  }
}
