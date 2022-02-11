import pagination from './components/Pagination.js'
import modal from './components/Modal.js'

import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const app = createApp({
	components: {
		pagination,
		modal
	},
	data() {
		return {
			ss: 'ss',
			pagination: 1,
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
		// addImg() {
		// 	this.product.imagesUrl.push('')
		// },
		// deleteImg() {
		// 	this.product.imagesUrl.pop()
		// },
    showProductModel(product) {
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
			// console.log(this.product, 'modalTitle')
    },
		showDeleteModal(product) {
			this.deleteModal.show()
			this.product = JSON.parse(JSON.stringify(product))
		},
		hideModel() {
			this.productModal.hide()
			this.deleteModal.hide()
		},
		getProducts(page=1) {
			const url = 'https://vue3-course-api.hexschool.io/v2'
			axios.get(`${url}/api/ciye-project/admin/products?page=${page}`)
			.then((response) => {
				console.log(response,'getProducts')
				this.products = response.data.products
				this.pagination = response.data.pagination
				this.loading = false
			})
			.catch(() => {
			})
		},
		uploadProduct() {
			this.loading = true
			const url = 'https://vue3-course-api.hexschool.io/v2'
			console.log(this.product, 'this.product')
			// post 資料如果傳送沒有值的陣列，取回來的資料就就不會有"imagesUrl"這個屬性，造成編譯錯誤
			if (this.product.imagesUrl.length == 0) {
				this.product.imagesUrl = ['']
			}
			let postProduct = {
				'data': this.product
			}
			axios.post(`${url}/api/ciye-project/admin/product`, postProduct)
			.then((response) => {
				this.loading = false
				// console.log(response, 'response')
				this.hideModel()
				this.getProducts()
			})
			.catch((err) => {
				alert('上傳失敗')
				// console.log(err, 'err')
				this.hideModel()
				this.loading = false
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
			.catch(() => {
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
			.catch(() => {
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
})
// 全域註冊
app.component('product-modal', {
	props: ['modaltitle', 'product', 'loading', 'isediting'],
	emits: ['hide-model', 'edit-product', 'upload-product'],

	template: '#templateForModal',
	data() {
		return {
			file: null
		}
	},
	methods: {
		addImg() {
			this.product.imagesUrl.push('')
		},
		deleteImg() {
			this.product.imagesUrl.pop()
		},
		fileReader() {
			// 解析上傳的檔案，讓 <img> 能即時顯示上傳的圖片
			// console.log(this.$refs.fileInput.files[0].type)
			if (this.$refs.fileInput.files[0].type !== 'image/jpeg' && this.$refs.fileInput.files[0].type !== 'image/png' ) {
				alert('僅支援 jpg、png 檔，請重新上傳！');
				return
			}
			this.file = null
			let reader = new FileReader();
			reader.readAsDataURL(this.$refs.fileInput.files[0])
			reader.onload = (e) => {
				this.file = e.target.result;
			}
		},
		imgUpload() {
			if (!this.file) return
			const url = 'https://vue3-course-api.hexschool.io/v2'
			let formData =  new FormData()
			formData.append('file-to-upload', this.$refs.fileInput.files[0])
			// console.log(this.$refs.fileInput.files, 'refs')
			axios.post(`${url}/api/ciye-project/admin/upload`, formData)
			.then((response) => {
				// console.log(response, 'response')
				alert('上傳成功')
				// this.hideModel()
				// this.getProducts()
			})
			.catch((err) => {
				alert('上傳失敗')
				// console.log(err, 'err')
				// this.hideModel()
				// this.loading = false
			})
		},
	},
})
app.component('delete-modal', {
	props: ['product', 'loading'],
	emits: ['hide-model', 'delete-product'],

	template: '#templateForDeleteModal',
})
app.mount('#app')