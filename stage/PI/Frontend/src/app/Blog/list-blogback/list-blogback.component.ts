import { Component, OnInit } from '@angular/core';
import { Publication } from '../../Models/Blog/publication';
import { BlogServiceService } from '../blog-service.service';
import { Router } from '@angular/router';
import { Comment } from 'src/app/Models/Comment/comment';

@Component({
  selector: 'app-list-blogback',
  templateUrl: './list-blogback.component.html',
  styleUrls: ['./list-blogback.component.css']
})
export class ListBlogbackComponent implements OnInit {
  publications: Publication[] = [];
  filteredPublications: Publication[] = [];
  searchInput: string = '';
  sortBy: keyof Publication = 'dateCreation';

  constructor(private blogService: BlogServiceService, private router: Router) { }

  ngOnInit(): void {
    this.fetchPublications();
  }
  fetchPublications(): void {
    this.blogService.getBlogList()
      .subscribe({
        next: (publications) => {
          this.publications = publications;
          console.log('Fetched publications:', this.publications); // Log the fetched publications
        },
        error: (error) => {
          console.error(error);
        }
      });
  }


  deletePublication(id: number): void {
    this.blogService.deleteBlog(id)
      .subscribe({
        next: () => {
          console.log('Publication deleted successfully');
          // You may want to refresh the list after deletion
          this.fetchPublications();
        },
        error: (error) => {
          console.error('Error deleting publication:', error);
        }
      });
  }

  approvePublication(id: number): void {
    this.blogService.approveBlog(id)
      .subscribe({
        next: () => {
          console.log('Publication approved successfully');
          // You may want to refresh the list after approval
          this.fetchPublications();
        },
        error: (error) => {
          console.error('Error approving publication:', error);
        }
      });
  }

  approveAllPublications(): void {
    this.blogService.approveAllBlogs()
      .subscribe({
        next: () => {
          console.log('All publications approved successfully');
          // You may want to refresh the list after approval
          this.fetchPublications();
        },
        error: (error) => {
          console.error('Error approving all publications:', error);
        }
      });
  }
  addCommentToPublication(id: number, commentData: string): void {
    const newComment: Comment = new Comment();
    newComment.contenu = commentData;
    // Optionally, you can set other properties of the new comment if needed
    
    this.blogService.addComment(id, newComment)
      .subscribe({
        next: () => {
          console.log('Comment added successfully');
          // You may want to refresh the list after adding the comment
          this.fetchPublications();
        },
        error: (error) => {
          console.error('Error adding comment:', error);
        }
      });
  }


}

