// $(document).ready(function () {
//   $('.delete-article').on('click', function (e) {
//     $target = $(e.target);
//     const id = $target.attr('data.id');
//     $.ajax({
//       type: 'DELETE',
//       url: '/article/' + id,
//       success: function (response) {
//         alert('Deleting Article');
//         window.location.href = '/';
//       },
//       error: function (err) {
//         console.log(err);
//       }

//     });
//   });

// });

function deleteArticle() {
  let id = document.querySelector('.delete-article').dataset.id;
  if (id) {
    // make a fetch delete call to this route
    return fetch('/articles/' + id, {
        method: 'delete'
      })
      .then(res => {
        console.log('Deleted')
        location.href = '/'
        return res
      });
  };
}
