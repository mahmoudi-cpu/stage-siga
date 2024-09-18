import { Component, OnInit } from '@angular/core';
import { BlogServiceService } from '../blog-service.service';
import { Publication } from 'src/app/Models/Blog/publication';
import { Comment } from 'src/app/Models/Comment/comment'

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {
  newPublication: Publication = {}; // Initialize an empty Publication object
  commentData: string = ''; // Variable to store comment data
  comments: Comment[] = []; // Array to store comments for the publication

  constructor(private blogService: BlogServiceService) { }

  ngOnInit(): void {
    // Fetch comments for the publication when the component initializes

  }

  // Method to add a new blog
  addBlog(): void {
    this.blogService.createBlog(this.newPublication)
      .subscribe({
        next: (response) => {
          console.log('Blog added successfully:', response);
          // Clear the form after adding the blog
          this.newPublication = {};
        },
        error: (error) => {
          console.error('Error adding blog:', error);
        }
      });
  }

  // Method to add a comment to the new publication
 


}
