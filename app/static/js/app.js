/* Add your Application JavaScript */

//
Vue.component('app-header', {
    template: `
    <nav class="mainh">
    <div class="sym">
        <p id="logo">{{head}}</p>
    </div>
      <div class="controls">
        <ul class="cc">
            <li class="">
            <router-link class="" to="/">Home</router-link>
          </li>
          <li class="" v-show="!this.$root.$data.isLogin">
            <router-link class="" to="/login">Login</router-link>
          </li>
          <li class="" v-show="!this.$root.$data.isLogin">
            <router-link class="" to="/register">Register</router-link>
          </li>
          <li class="">
            <router-link class="" to="/explore">Explore</router-link>
          </li>
          <li class="">
            <router-link class="" to="/posts/new">Make a Post</router-link>
          </li>
          <li class="">
            <router-link class="" :to="'/users/'+ this.$root.$data.userID ">My Profile</router-link>
          </li>
          <li class="" v-show="this.$root.$data.isLogin">
            <router-link class="" to="/logout"><span @click="logout">Logout</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `,
    data:function(){
        return{
            head:"photogram"
        }
    },
    methods:
    {
        logout()
         {
            fetch(`${window.origin}/api/auth/logout`,{
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('acctoken'),
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then((resp) => {
                resp.json().then((data)=>{
                    if(data.message == "logged out")
                    {
                        localStorage.clear()
                        this.$root.$data.isLogin = false
                        router.push({ path: `/logout` })
                    }
                    else
                    {
                        console.log("error occur")
                    }
                })
            })
            localStorage.clear()
            this.$root.$data.isLogin = false
            router.push({ path: `/logout` })

            
         }
        
    }
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
    template: `
     <div class="jumbotron">
         <h1>Photogram</h1>
         <p class="lead">WTF.</p>
     </div>
    `,
     data: function() {
        return {}
     }
 });

const Explore = Vue.component('explore',{
    template:`
    <div class="center-align">
        <div class="posti">
            <div id="explore-feed">
                <div id="feed-i" v-for="feed in feeds" :key="feed.post_id">
                    <div id="xfeed">
                        <div id="ud">
                            <router-link :to="'/users/'+feed.user_id"><img :src="feed.userphoto" width="45px" height="45px"/></router-link>
                            <div id="uname"><p>{{feed.username}}</p></div>
                        </div>
                    </div>                
                    <img :src="feed.postphoto"/>
                    <div class="sd">
                    <div id="caption">
                        <p>{{feed.caption}}</p>
                    </div>
                    <div id="post-date">
                        <span id="likes">
                        <img src="/static/img/heart.svg" @click="like(feed.post_id)" v-if="feed.num_likes >= 1"/>
                        <img src="/static/img/empty.svg" @click="like(feed.post_id)" v-if="feed.num_likes == 0"/>
                        <p>{{feed.num_likes}} Likes</p></span>
                        <span id="postDate"><p @click="like(feed.post_id)">{{feed.posted_on}}</p></span>
                    </div>
                    </div>
                </div>
            </div>
            <div class="makenew">
                <router-link class="" to="/posts/new"><button>Make a Post</button></router-link>
            </div>
        </div>
    </div>`,
    data(){
        return{
            name:'explore',
            id:23,
            uid:localStorage.getItem('user_id'),
            feeds:[],
            location:''
        }
    },
    methods:{
        like(id)
        {
            let req = {
                user_id:this.uid,
            }
            x = JSON.stringify(req)
            fetch(`${window.origin}/api/posts/${id}/like`,{
                method: 'POST',
                body: x,
                headers: {
                    'Authorization':'Bearer '+localStorage.getItem('acctoken'),
                    'content-type': 'application/json',
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then((resp) => {
                resp.json().then((data)=>{
                    console.log(data)
                })
            })
            
        },
        n()
        {
            console.log(feed)
        }
    },
    created()
    {
        fetch(`${window.origin}/api/posts`,{
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('acctoken'),
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
        .then((resp) => {
            resp.json().then((data)=>{
                this.feeds = data
                //console.log(data.token)
            })
        })

    }

});
const Login = Vue.component('login', {
   template: `
    <div class="justify-content-center">
        <div class="form_control">
            <form id="login_form" @submit.prevent="handleSubmit">
                <span>Login to your account</span>
                <div class="form-field">
                    <label for="email">Email</label><br>
                    <input type="text" name="email" ref="email" v-model="email"/>
                </div>
                <div class="form-field">
                    <label for="password">Password</label><br>
                    <input type="password" name="password" ref="password" v-model="password"/>
                </div>
                <div class="form-field">
                    <button type="submit">Login</button>
                </div>
            </form>
            <span>Don't have an account?<router-link class="" to="/register">Register</router-link></span>
        </div>
    </div>
   `,
    data(){
       return {
           email:'',
           password:''
       }
    },
    methods:
    {
        handleSubmit()
        {
            let req = {
                email:this.email,
                password:this.password
            }
            x = JSON.stringify(req)
            //console.log(x)
            fetch(`${window.origin}/api/auth/login`,{
                method: 'POST',
                body: x,
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then((resp) => {
                resp.json().then((data)=>{
                    localStorage.setItem('acctoken', data.token)
                    localStorage.setItem('user_id',data.udetails.user_id)
                    localStorage.setItem('user_email',data.udetails.email)
                    this.$root.$data.isLogin = true
                    router.push({ path: `/users/${localStorage.getItem('user_id')}` })
                    //console.log(data.token)
                })
            })
        }
    }
});

const Logout = Vue.component('logout', {
    template: `
     <div class="jumbotron">
         <h1>Thank You</h1>
         <p class="lead">We want to see your posting soon</p>
     </div>
    `,
     data: function() {
        return {}
     }
 });
const Register = Vue.component('register', {
    template: `
    <div class="justify-content-center">
    <div class="form_control">
        <form id="register_form" ref="register_form" @submit.prevent="handleSubmit" enctype=multipart/form-data>
            <span>Let's get you registered!</span>
            <div class="form-field">
                <label for="username">Username</label><br>
                <input type="text" name="username" ref="username" v-model="username"/>
            </div>
            <div class="form-field">
                <label for="firstname">Firstname</label><br>
                <input type="text" name="firstname" ref="firstname" v-model="firstname"/>
            </div>
            <div class="form-field">
                <label for="lastname">Lastname</label><br>
                <input type="text" name="lastname" ref="lastname" v-model="lastname"/>
            </div>
            <div class="form-field">
                <label for="email">Email</label><br>
                <input type="text" name="email" ref="email" v-model="email"/>
            </div>
            <div class="form-field">
                <label for="location">Location</label><br>
                <input type="text" name="location" ref="location" v-model="location"/>
            </div>
            <div class="form-field">
                <label for="biography">Biography</label><br>
                <textarea class="form-control"  name="biography" rows="2" v-model="biography"></textarea>
            </div>
            <div class="form-field">
                <label for="profile">Profile Photo</label><br>
                <input type="file" name="pphoto" ref="pphoto"/>
            </div>
            <div class="form-field">
                <label for="password">Password</label><br>
                <input type="password" name="password" ref="password" v-model="password"/>
            </div>
            <div class="form-field">
                <label for="re-enter password">Re-Enter Password</label><br>
                <input type="password" name="password_two" ref="password_two" v-model="password_two"/>
            </div>
            <div class="form-field">
            <button type="submit">Register</button>
            </div>
        </form>
        <span>Already got an account?<router-link class="" to="/">Login</router-link></span>
    </div>
{{username}}
</div>
    `,
     data() {
        return {
            username:'',
            firstname:'',
            lastname:'',
            email:'',
            location:'',
            biography:'',
            profile_photo:'',
            password:'',
            password_two:''

        }
     },
     methods:{
         handleSubmit(){
            
            let fdata = new FormData(document.getElementById('register_form'));
            fetch(`${window.origin}/api/users/register`,{
                method: 'POST',
                body: fdata,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then((resp) => {
                resp.json().then((data)=>{
                    console.log(data)
                })
            })
         }
     }
 }); 

const newPost = Vue.component('makepost',{
    template:
    `<div class="center-align">
        <div class="form_control">
            <h3>New Post</h3>
            <form id="post_form" ref="post_form" @submit.prevent="handleSubmit" enctype=multipart/form-data>
                <div class="form-field">
                    <label for="post">Photo</label><br>
                    <input type="file" name="postphoto" ref="postphoto"/>
                </div>    
                <div class="form-field">
                    <label for="caption">Caption</label><br>
                    <textarea class="form-control"  name="caption" rows="2" v-model="caption" placeholder="What would you like to say?"></textarea>
                </div>
                <div class="form-field pbutton">
                    <button type="submit">Post</button>
                </div>
            </form>
        </div>
    </div>
        `,
    data()
    {
        return{
            caption:''
            
        }
    },
    methods:{
        handleSubmit()
        {
            let fdata = new FormData(document.getElementById('post_form'));
            if(this.caption !== "")
            {
                fetch(`${window.origin}/api/users/${localStorage.getItem('user_id')}/posts/add`,{
                    method: 'POST',
                    body: fdata,
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('acctoken'),
                        'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
                })
                .then((resp) => {
                    resp.json().then((data)=>{
                        alert(data.message)
                        
                    })
                })
                .catch(err)
                {
                    console.log(err)
                }
                

            }
            else
            {
                alert("Please fill out the the form")
            }
            
            
        }
    }
});

const userProfile = Vue.component('userprofile', {
    template: `
    <div>
        <div>
            <div class="user-personal">
                <img :src="profile[0].profile_photo" id="uprofilepic"/>
                <div class="user-text">
                    <h2>{{profile[0].firstname}} {{profile[0].lastname}}</h2>
                    <p id="location">{{profile[0].location}}</p>
                    <p id="member">Member since {{profile[0].joined}}</p>
                    <p id="bio">{{profile[0].biography}}</p>
                </div>
                <div id="stats">
                    <div id="nstats">
                        <div id="num-post">
                            <p id="pnum">{{userPost.length}}</p>
                            <p id="pt">Posts</p>
                        </div>
                        <div id="num-post">
                            <p id="pnum">{{userPost.length}}</p>
                            <p id="pt">Followers</p>
                        </div>
                    </div>
                    <button>Follow</button>
                </div>
            </div>
            <div class="post_grid">
                <div class=" post_item" v-for="ps in userPost" :key="ps.caption">
                    <img :src="ps.postphoto" />
                </div>
            </div>
        </div>
    </div>
    `,
    data: function () {
        return {
            uid:this.$route.params.uid,
            profile:[],
            userPost:[]
        }
    },
    created()
    {
        console.log(this.uid)
        fetch(`${window.origin}/api/users/${this.uid}/posts`,{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('acctoken'),
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
        .then((resp) => {
            resp.json().then((data)=>{
                this.profile = data.profileDetails
                this.userPost = data.userPost
                
            })
        })
        console.log(`${window.origin}/${this.uid}`)
    }
})

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        {path: "/login", component: Login},
        {path: "/register", component: Register},
        {path: "/explore", component: Explore, meta:{requiresAuth:true}},
        {path: "/posts/new", component: newPost, meta:{requiresAuth:true}},
        {path: "/users/:uid", component: userProfile, meta:{requiresAuth:true}},
        {path: "/logout", component: Logout, meta:{requiresAuth:true}},
        // Put other routes here

        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});
router.beforeEach((to,from,next)=>{
    let authenticated = localStorage.getItem('userstat');
    if(to.matched.some(record => record.meta.requiresAuth))
    {
        //check's if the user is authenticated
        if(localStorage.getItem('acctoken') != null)
        {
            next();
        }
        else
        {
            try
            {
                router.replace('/login');
            }
            catch(err)
            {
                console.log(err)
            }
        }
    }

    //Allowing page to load
    else{
        next();
    }
});
// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router,
    data:
    {
        isLogin:true,
        userID:localStorage.getItem('user_id')
    }


});