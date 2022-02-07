const app = Vue.createApp({
	data() {
		return {
			products: [],
			product: {
				"imagesUrl": [],
			},
			
			loading: false,
			isEditing: false,
			productModal: null,
			deleteModal: null,
			modalTitle: null
		}
	},
	methods: {
		addImg() {
			this.product.imagesUrl.push('')
		},
		deleteImg() {
			this.product.imagesUrl.pop()
			console.log(this.product)
		},
    showProductModel(product) {
			console.log(product)
			if (product.title) {
				this.modalTitle = '編輯產品'
				this.isEditing = true
				this.product = JSON.parse(JSON.stringify(product))
			} else {
				this.modalTitle = '新增產品'
				this.isEditing = false
				this.product = {
					"imagesUrl": [],
				}
			}
			this.productModal.show()
    },
		showDeleteModal(product) {
			this.deleteModal.show()
			this.product = JSON.parse(JSON.stringify(product))
		},
		hideModel() {
			this.productModal.hide()
			this.deleteModal.hide()
		},
		getProducts() {
			const url = 'https://vue3-course-api.hexschool.io/v2'
			console.log(this.user)
			axios.get(`${url}/api/ciye-project/admin/products`)
			.then((response) => {
				console.log(response, 'asd')
				this.products = response.data.products
				this.loading = false
			})
			.catch((err) => {
				console.log(err)
			})
		},
		uploadProduct() {
			this.loading = true
			const url = 'https://vue3-course-api.hexschool.io/v2'
			// post 資料如果傳送沒有值的陣列，取回來的資料就就不會有"imagesUrl"這個屬性，造成編譯錯誤
			if (this.product.imagesUrl.length == 0) {
				this.product.imagesUrl = ['']
			}
			let postProduct = {
				'data': this.product
			}
			console.log(this.product)
			axios.post(`${url}/api/ciye-project/admin/product`, postProduct)
			.then((response) => {
				console.log(response, '新增產品')
				this.loading = false
				this.hideModel()
				this.getProducts()
			})
			.catch((err) => {
				alert('上傳失敗')
				this.hideModel()
				this.loading = false
				console.log(err)
			})
		},
		editProduct() {
			this.loading = true
			const url = 'https://vue3-course-api.hexschool.io/v2'
			let postProduct = {
				'data': this.product
			}
			axios.put(`${url}/api/ciye-project/admin/product/${this.product.id}`, postProduct)
			.then(() => {
				this.hideModel()
				this.getProducts()
			})
			.catch((err) => {
				console.log(err)
			})
		},
		deleteProduct() {
			this.loading = true
			const url = 'https://vue3-course-api.hexschool.io/v2'
			axios.delete(`${url}/api/ciye-project/admin/product/${this.product.id}`)
			.then(() => {
				this.hideModel()
				this.getProducts()
			})
			.catch((err) => {
				console.log(err)
			})
		},
		signinCheck() {
			const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    	axios.defaults.headers.common['Authorization'] = token;
			this.loading = true
			const url = 'https://vue3-course-api.hexschool.io/v2'
			axios.post(`${url}/api/user/check`)
			.then(() => {
				this.getProducts()
			})
			.catch(() => {
				window.location = 'index.html'
			})
		}
  },
	mounted() {
		this.productModal = new bootstrap.Modal(this.$refs.myModal)
		this.deleteModal = new bootstrap.Modal(this.$refs.delProductModal)
		this.signinCheck()
	}
}).mount('#app')