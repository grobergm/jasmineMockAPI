const MockAPI= require('../MockAPI.js');

describe("Mock API",()=>{
	let mockAPI;
	let mockDatabase=
	{
		users:[
			{
				name:"Jack",
				password:"beanstock",
				posts:["I just found some magic beans!"]
			},
			{
				name:"Jill",
				password:"hill",
				posts:["Jack fell down!"]
			},
		]
	};

	beforeEach(()=>{
		mockAPI= new MockAPI(mockDatabase)
	})

	it("returns a 400 bad request status of the request is invalid",()=>{
		const mockApiCall=mockAPI.processRequest({})
		return mockApiCall.then(response=>{
			expect(response.status).toBe(400)
		})
	})

	describe("get requests",()=>{
		const validRequest={method:'get',params:{user:"Jack"}};
		const invalidRequest={method:'get',params:{user:"Tod"}};

		it("returns a 404 status if a user is not found",()=>{
			const mockApiCall=mockAPI.processRequest(invalidRequest)
			return mockApiCall.then(response=>{
				expect(response.status).toBe(404)
			})
		});

		it("returns a 200 status with a users posts",()=>{
			const mockApiCall=mockAPI.processRequest(validRequest)
			return mockApiCall.then(response=>{
				expect(response.status).toBe(200)
				expect(response.posts).toEqual(["I just found some magic beans!"])
			})
		});
	})

	describe("post requests",()=>{
		const validRequest={method:'post',params:{user:"Jill",password:'hill',post:"He broke his crown!"}}
		const invalidRequest={method:'post',params:{user:"Jill",password:'beanstock',post:"Jack is cool..."}}

		it("returns a 401 unauthorized status if the wrong credentials are sent",()=>{
			const mockApiCall=mockAPI.processRequest(invalidRequest)
			return mockApiCall.then(response=>{
				expect(response.status).toBe(401)
				expect(mockAPI.db).toEqual(mockDatabase)
			})
		})

		it("returns a 200 status and adds the post to the database",()=>{
			const newDatabase={
				users:[
					{
						name:"Jack",
						password:"beanstock",
						posts:["I just found some magic beans!"]
					},
					{
						name:"Jill",
						password:"hill",
						posts:["Jack fell down!","He broke his crown!"]
					},
				]
			}
			const mockApiCall=mockAPI.processRequest(validRequest)
			return mockApiCall.then(response=>{
				expect(response.status).toBe(200)
				expect(mockAPI.db).toEqual(newDatabase)
			})
		})
	})
})