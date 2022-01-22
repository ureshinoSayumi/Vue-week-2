const app = Vue.createApp({
	data() {
		return {
			products: [],
			product: {},
			loading: false
		}
	},
	methods: {
    showModel(product) {
      this.product = product
    },
		getProducts() {
			const url = 'https://vue3-course-api.hexschool.io/v2'
			console.log(this.user)
			axios.get(`${url}/api/ciye-project/admin/products`)
			.then((response) => {
				console.log(response, '六角產品')
				this.products = response.data.products
				this.loading = false
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
			.then((response) => {
				this.getProducts()
			})
			.catch((err) => {
				window.location = 'index.html'
			})
		}
  },
	mounted() {
		this.signinCheck()
	}
}).mount('#app')