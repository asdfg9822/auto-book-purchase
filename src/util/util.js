/**
 * Created by JongHyeok Choi on 12/12/2018.
 */

/**
 * CSV (아래 예시)
 * TempUser	부서	직급	010-8284-9025	jhhj9822@gmail.com	http://github.co.kr	10000	BookName	Address	END_LINE
 */
const mapping = [
    {
        name: "name",
        convert: function (str) {
            return str.replace(/\s/g, "").replace(/\n/g, "");
        }
    },
    {
        name: "dept",
        convert: function (str) {
            return str.replace(/\s/g, "").replace(/\n/g, "");
        }
    },
    {
        name: "rank",
        convert: function (str) {
            return str.replace(/\s/g, "").replace(/\n/g, "");
        }
    },
    {
        name: "phone",
        convert: function (str) {
            return str.replace(/\s/g, "").replace(/\n/g, "");
        }
    },
    {
        name: "email",
        convert: function (str) {
            return str.replace(/\s/g, "").replace(/\n/g, "");
        }
    },
    {
        name: "bookLinks",
        convert: function (str) {
            return str.replace(/[ \"]/g, "").split("\n");
        }
    },
    {
        name: "prices",
        convert: function (str) {
            return str.replace(/[ ,]/g, "").split("\n");
        }
    },
    {
        name: "bookNames",
        convert: function (str) {
            return str.replace(/ /g, "").split("\n");
        }
    },
    {
        name: "address",
        convert: function (str) {
            return str.trim();
        }
    },
];

class Util {
    static convertCsvToObjs(csvStr) {
        return csvStr.split("END_LINE").map((row) => {
            const userInfo = {};
            row.split("\t").forEach((col, index) => {
                if(mapping[index]) {
                    const mappingName = mapping[index].name;
                    const convert = mapping[index].convert;
                    userInfo[mappingName] = convert(col);
                }
            });
            return userInfo;
        });
    }
    static groupByFieldValue(objs, field) {
        const resultObj = {};
        objs.forEach((obj) => {
            if(resultObj.hasOwnProperty(obj[field])) {
                resultObj[obj[field]].push(obj);
            } else {
                resultObj[obj[field]] = [];
                resultObj[obj[field]].push(obj);
            }
        });

        return resultObj;
    }

    /**
     * TODO
     * @param objs
     * @param field
     * @returns {{}}
     */
    static groupByFieldArrValue(objs, field) {
        const resultObj = {};
        objs.forEach((obj) => {
            if(resultObj.hasOwnProperty(obj[field])) {
                resultObj[obj[field]].push(obj);
            } else {
                resultObj[obj[field]] = [];
                resultObj[obj[field]].push(obj);
            }
        });

        return resultObj;
    }
}

module.exports = Util;