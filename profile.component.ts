import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';
import { api_endpoints } from '../../../app/api_endpoints';
import { AppComponent } from '../../app.component';
import Swal from 'sweetalert2';
declare var $;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  profile_status: any = true;
  _user_img_size: 2000000000;
  _user_img_type_error: any;
  _user_img_error: boolean;
  _user_img_size_error: any;
  _user_img_type: any = ['image/jpeg', 'image/png'];
  user_image: any = { 'size': '', 'type': '', 'file': '', 'fileName': '' };
  _user_img: any;
  _file: any;
  _header: any = null;
  constructor(private _activated_route: ActivatedRoute, private _http: Http, private _router: Router) { }
  ngOnInit() {
    window.scrollTo(0, 0);
    // tslint:disable-next-line:max-line-length
    this._header = { headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': window.sessionStorage.getItem('session_token') }) };
    this.user = JSON.parse(window.sessionStorage.getItem('user_detail'));
  }
  change_profile() {
    this.profile_status = !this.profile_status;
  }
  user_prof_image(evt) {
    this._file = evt.target.files;
    const reader = new FileReader();
    const file: File = evt.target.files;
    this.user_image['size'] = file[0].size;
    this.user_image['type'] = file[0].type;
    this.user_image['fileName'] = file[0].name;
    this._user_img = file[0].name;
    if (this._user_img_type.indexOf(file[0].type) < 0) {
      this._user_img_size_error = null;
      this._user_img_error = true;
      this._user_img_type_error = 'Image type does not matched.';
      $('#faclt_new_faculty').attr('disabled', true);
    } else if (this._user_img_size <= file[0].size) {
      this._user_img_type_error = null;
      this._user_img_error = true;
      this._user_img_size_error = 'Image size does not matched.';
      $('#faclt_new_faculty').attr('disabled', true);
    } else {
      this.user_image = { 'size': '', 'type': '', 'file': '', 'fileName': '' };
      this._user_img_type_error = null;
      this._user_img_size_error = null;
      this.user_image['size'] = file[0].size;
      this.user_image['type'] = file[0].type;
      this.user_image['fileName'] = file[0].name;
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        $('#prev_prod_img').attr('src', reader.result);
        this.user_image['file'] = reader.result;
      };
      this._user_img_error = false;
    }
  }
  onUpdateUserSubmit(data) {
    this._http.post(api_endpoints + '/authentication/update_user', {
      user: {
        id: this.user.id,
        first_name: data.sign_up_fname,
        last_name: data.sign_up_lname,
        gender: data.sign_up_gender,
        dob: data.sign_up_dob,
        picture: this.user_image,
        address: data.sign_up_address,
        mobile_no: data.sign_up_mobile_no
      }
    }, this._header).subscribe(
      res => {
        if (JSON.parse(res['_body']).status === 200) {
          Swal({
            title: 'Thank You',
            text: JSON.parse(res['_body']).message,
            type: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.sessionStorage.setItem('user_detail', JSON.stringify(JSON.parse(res['_body']).data));
            this.user = JSON.parse(window.sessionStorage.getItem('user_detail'));
            this.profile_status = !this.profile_status;
            this._user_img = null;
          });
        } else {
          Swal({
            title: 'Warning',
            text: JSON.parse(res['_body']).message,
            type: 'warning',
            confirmButtonText: 'Ok'
          });
        }
      },
      err => {
        console.log('Error occured');
      }
    );
  }
}
