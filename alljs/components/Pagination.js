export default {
	props: ['pages'],
	emits: ["get-products"],
	template: `<nav aria-label="Page navigation example">
		<ul class="pagination">
			<li class="page-item" :class="{ disabled: !pages.has_pre }">
				<a class="page-link" href="#" aria-label="Previous" @click="$emit('get-products', pages.current_page-1)">
					<span aria-hidden="true">&laquo;</span>
				</a>
			</li>
			<li class="page-item" 
				:class="{ active: page === pages.current_page }"
				v-for="page in pages.total_pages" :key="page + 'page'">
				<a class="page-link" href="#" 
					@click="$emit('get-products', page)">
					{{ page }}
				</a>
			</li>
			<li class="page-item" :class="{ disabled: !pages.has_next }">
				<a class="page-link" href="#" aria-label="Next" @click="$emit('get-products', pages.current_page+1)">
					<span aria-hidden="true">&raquo;</span>
				</a>
			</li>
		</ul>
	</nav>`,
	data() {
		return{
			data: '原件'
		}
	},
	methods: {

	},
	mounted() {
		// console.log(this.data, 'asd')
	},

}