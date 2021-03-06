const resource = require('resource-router-middleware');
const axios = require('axios');

let facets = [13213,32432,25];

module.exports = ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'first',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		let facet = facets.find( facet => facet.id===id ),
			err = facet ? null : 'Not found';
		callback(err, facet);
	},

	/** GET / - List all entities */
	index({ params, query }, res) {
		axios.get('https://api.github.com/search/repositories?q=node')
		.then(function (response) {
			res.json({
				code: 1,
				data: response.data
			});
		}).catch(function (error) {
			res.json({
				code: -1,
				msg: "未获取到信息！"
			});
		});
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
		console.log(body);
		body.id = facets.length.toString(36);
		body.asdsa = [12321,234];
		facets.push(body);
		res.json(body);
	},

	/** GET /:id - Return a given entity */
	read({ facet }, res) {
		res.json(facet);
	},

	/** PUT /:id - Update a given entity */
	update({ facet, body }, res) {
		for (let key in body) {
			if (key!=='id') {
				facet[key] = body[key];
			}
		}
		res.sendStatus(204);
	},

	/** DELETE /:id - Delete a given entity */
	delete({ facet }, res) {
		facets.splice(facets.indexOf(facet), 1);
		res.sendStatus(204);
	}
});
