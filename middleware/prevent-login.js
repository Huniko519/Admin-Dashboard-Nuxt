//  this middleware to prevent openning signin page while you are already signed in.
export default function (context) {
  if (context.store.getters.isAuthenticated) {
    context.redirect("/en/dashboard")
  }
}
