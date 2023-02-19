const Outline = () => {
  return 0;
};

export default Outline;

// pdf.getOutline get dest
// pdf.getDestination get ref {num,gen}
// pdf.getPageIndex get pageNumber;
// pdf.getOutline().then((res) => {
//   res.map((outline) => {
//     if (typeof outline.dest === "string") {
//       pdf.getDestination(outline.dest).then((dest) => {
//         dest &&
//           pdf.getPageIndex(dest[0]).then((page) => {
//             console.log(page + 1, outline.title);
//           });
//       });
//     }
//   });
// });
