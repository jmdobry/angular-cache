var defaults = {
	capacity: Number.MAX_VALUE,
	maxAge: Number.MAX_VALUE,
	deleteOnExpire: 'none',
	onExpire: null,
	cacheFlushInterval: null,
	recycleFreq: 1000,
	storageMode: 'memory',
	storageImpl: null,
	disabled: false
};

function Config() {
}

for (var option in defaults) {
	Config.prototype['$$' + option] = defaults[option];
}

module.exports = {
	Config: Config,
	defaults: defaults
};
