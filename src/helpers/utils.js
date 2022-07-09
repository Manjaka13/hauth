/*
	Various usefull functions
*/

// Formats data
const formatData = (data) => {
	if (data) {
		if (data._doc)
			data = { ...data._doc };
		if (!data.id)
			data.id = data._id;
	}
	return data;
};

// Formats array of data
const formatDataList = (dataList) => dataList.map(formatData);

// Remove restricted fields
const protectData = (data) => {
	if (data) {
		delete data.password;
		delete data.confirmationId;
		delete data._id;
		delete data.__v;
		delete data.createdAt;
		delete data.updatedAt;
		return data;
	}
	return null;
};

// Protects array of data
const protectDataList = (dataList) => dataList.map(protectData);

// Filters those who are admins
const filterAdmin = (dataList) => dataList ? dataList.filter(isAdmin) : dataList;

// Checks if account is admin
const isAdmin = (account) => account ? (account?.level >= 0 && account?.level < 2) : false;

module.exports = {
	protectData,
	protectDataList,
	formatData,
	formatDataList,
	filterAdmin,
	isAdmin
};
