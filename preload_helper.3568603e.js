!function(){"use strict";var t="/".replace(/([^/])$/,"$1/"),e=location.pathname,n=e.startsWith(t)&&decodeURI("/".concat(e.slice(t.length)));if(n){var a=document,c=a.head,r=a.createElement.bind(a),i=function(t,e,n){var a,c=e.r[t]||(null===(a=Object.entries(e.r).find((function(e){var n=e[0];return new RegExp("^".concat(n.replace(/\/:[^/]+/g,"/[^/]+").replace("/*","/.+"),"$")).test(t)})))||void 0===a?void 0:a[1]);return null==c?void 0:c.map((function(t){var a=e.f[t][1],c=e.f[t][0];return{type:c.split(".").pop(),url:"".concat(n.publicPath).concat(c),attrs:[["data-".concat(e.b),"".concat(e.p,":").concat(a)]]}}))}(n,{"p":"ant-design-pro","b":"webpack","f":[["54.3cd59396.async.js",54],["p__Welcome.e6c071c5.async.js",185],["p__Classes__Attendance__index.1ccc3b95.async.js",208],["t__plugin-layout__Layout.5012e1ab.chunk.css",301],["t__plugin-layout__Layout.56bf9fe3.async.js",301],["316.37bc0917.async.js",316],["333.1fdb827c.async.js",333],["p__User__Login__index.66cb3b9e.chunk.css",366],["p__User__Login__index.028e18ea.async.js",366],["390.cbac4733.async.js",390],["393.69b70a30.async.js",393],["p__Classes__ClassesList__index.61e45739.chunk.css",418],["p__Classes__ClassesList__index.c03a1821.async.js",418],["p__Teacher__TeacherList__index.9a9cd133.async.js",559],["p__404.9be3905b.async.js",571],["649.f96fed0c.async.js",649],["p__Student__StudentList__index.2d8dc683.async.js",684],["687.ec072691.async.js",687],["712.6eab8269.async.js",712],["845.c885199f.async.js",845],["p__Course__CourseList__index.97c2d55a.chunk.css",875],["p__Course__CourseList__index.682efe4e.async.js",875],["902.52713600.async.js",902],["905.faaab627.async.js",905],["p__Family__FamilyList__index.106c781d.async.js",919]],"r":{"/*":[14,23],"/":[0,3,4,17,18,23],"/welcome":[0,1,10,3,4,17,18,23],"/user/login":[7,8,19],"/student/studentList":[0,5,6,16,18,19,22,23,3,4,17],"/family/familyList":[0,5,6,18,19,22,23,24,3,4,17],"/course/courseList":[0,10,18,19,20,21,22,23,3,4,17],"/teacher/teacherList":[0,13,15,18,19,22,23,3,4,17],"/classes/classesList":[0,5,11,12,18,19,22,23,3,4,17],"/classes/attendance":[0,2,18,19,22,23,3,4,17]}},{publicPath:"/"});null==i||i.forEach((function(t){var e,n=t.type,a=t.url;if("js"===n)(e=r("script")).src=a,e.async=!0;else{if("css"!==n)return;(e=r("link")).href=a,e.rel="preload",e.as="style"}t.attrs.forEach((function(t){e.setAttribute(t[0],t[1]||"")})),c.appendChild(e)}))}}();