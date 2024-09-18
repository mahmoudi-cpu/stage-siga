import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient}from "@angular/common/http";
import { Publication } from '../Models/Blog/publication';
import { Comment } from '../Models/Comment/comment';



@Injectable({
  providedIn: 'root'
})

export class BlogServiceService {
  private baseUrl='http://localhost:8084/publication' 

  constructor(private http:HttpClient) { }
  getBlogList(): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.baseUrl}/getall`);
  }  
  getToAprovedBlogs(): Observable<any> {  
    return this.http.get(`${this.baseUrl}`+'/getallunapproved');  
  }  
  getAprovedBlogs(): Observable<any> {  
    return this.http.get(`${this.baseUrl}`+'/getallapproved');  
  }  
  
  createBlog(blogData: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.baseUrl}`+'/add', blogData, { headers });
  }
  
  deleteBlog(id: number): Observable<any> {  
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });  
  }  
  getBlog(id: number): Observable<Publication> {  
    return this.http.get<Publication>(`${this.baseUrl}/getDetailsBlog/${id}`);  
  }  
 
  updateBlog(id: number, blog: Publication): Observable<Object> {  
    return this.http.put(`${this.baseUrl}/update/${id}`, Publication);  
  }  

  

  // getPhoto(photo: string): string{
  //   const photoUrl = `${this.baseUrl}/download/${photo}`;

  //   return `${this.baseUrl}/download/${photo}`;
  // }
  addComment(id: number,comment: Comment): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(`http://localhost:8083/commentaire/addcommentaire/${id}`, comment, { headers });
    }

  approveBlog(id: number): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put(`${this.baseUrl}`+`/approve/${id}`,{ headers });
  }
  approveAllBlogs(): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put(`${this.baseUrl}`+`/approveAll`,{ headers });
  }
  getCommentsForPublication(publicationId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`http://localhost:8083/commentaire/get/byPublication/${publicationId}`);
  }
  
}
