module.exports=class MockAPI {
	constructor(database){
		this.db=database;
		this.processRequest=this.processRequest.bind(this);
		this.getUser=this.getUser.bind(this);
		this.passwordIsValid=this.passwordIsValid.bind(this);
		this.addToPosts=this.addToPosts.bind(this);
	}

	processRequest(request){
		return new Promise((resolve,reject)=>{
			setTimeout(()=>{
				switch(request.method){
					case 'get':
						const user=this.getUser(request)
							if(user){
								resolve({status:200,posts:user.posts})
							} else {
								resolve({status:404, message:"Not Found"})
							}
						break;
					case 'post':
						if(this.passwordIsValid(request)){
							this.addToPosts(request)
							resolve({status:200,message:"Added Post"})
						} else{
							resolve({status:401,message:"Unauthorized"})
						}
						break;
					default :
						resolve({status:400, message:'Bad Request'})
				}
			},300)
		})
	}

	getUser(request){
		return this.db.users.find(function(user){
			return user.name===request.params.user
		})
	}

	passwordIsValid(request){
		const user=this.getUser(request)
		return user.password === request.params.password
	}

	addToPosts(request){
		const userIndex=this.db.users.findIndex(function(user){
			return user.name===request.params.user;
		})
		this.db.users[userIndex].posts.push(request.params.post)
	}
}
