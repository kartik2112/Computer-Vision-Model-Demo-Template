import { Component } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {
  file1:any;
  file2:any;
  public imagePath;
  imgURL1: any;
  imgURL2: any;
  waitingResponse = false;
  outputResult = -1;
  conf: number = 0;

  constructor(private ng2ImgMax: Ng2ImgMaxService, private httpClient: HttpClient){}
  /**
   * on file drop handler
   */
  onFileDropped($event,imgNo) {
    this.prepareFile($event,imgNo);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(file,imgNo) {
    this.prepareFile(file,imgNo);
  }
  prepareFile(files: Array<any>,imgNo) {
    console.log(!this.imgURL1 || !this.imgURL2)
    this.outputResult = -1;
    console.log(files[0])
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      alert("Only images are supported")
      return;
    }

    // ng2ImgMax resizes the image such that the height and width don't cross the mentioned dimensions
    //  while maintaining the aspect ratio
    this.ng2ImgMax.resizeImage(files[0], 224, 224).subscribe(
      result => {
        console.log('Resized')
        console.log(result)
        this['file'+imgNo] = result;
        var reader = new FileReader();
        this.imagePath = result;
        reader.readAsDataURL(result); 
        reader.onload = (_event) => { 
          this['imgURL'+imgNo] = reader.result; 
        }
      },
      error => {
        console.log('😢 Oh no!', error);
      }
    );
 
    
  }


  verifySign(){

    const formData: FormData = new FormData();

    // append image files to formData
    formData.append('img1', this.file1);
    formData.append('img2', this.file2);

    this.waitingResponse = true;

    // After deploying server.py to Heroku, mention the app-name over here
    // this.httpClient.post('https://app-name.herokuapp.com/yourendpoint', formData)
    this.httpClient.post('http://127.0.0.1:8000/yourendpoint', formData)
      .subscribe(
        (response: any) => {
            // Depending on your application, this processing will change
            // Here, using the confidence score, we are displaying the appropriate text on front-end
            console.log(response);

            // Here, response is sigmoid output of model with values between 0, 1
            this.outputResult = Math.round(response);

            if(Math.round(response) == 1){
              this.conf = Math.round(response * 100) / 100; // Confidence score for output = 1
            }
            else{
              this.conf = 1 - Math.round(response * 100) / 100; // Confidence score for output = 0
            }
            this.waitingResponse = false;
        },
        (error: any) => {
            console.log(error);
            this.waitingResponse = false;
        });
    

  }
}
