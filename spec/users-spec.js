const MockAPI= require('../MockAPI.js');

describe("Mock API",()=>{
	let mockAPI;

	beforeEach(()=>{
		mockAPI= new MockAPI()
	})

	it("returns a 400 bad request status if the request is invalid",()=>{
		const request={}
		const promise=mockAPI.processRequest(request)
		return promise.then(response=>{
			expect(response.status).toBe(400)
		})
	})

})