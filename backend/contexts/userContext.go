package contexts

/* func UserContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		userID := chi.URLParam(r, "userId")

		var user models.User

		database := services.GetConnection()

		database.First(&user, userID)

		if user.ID == 0 {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		ctx := context.WithValue(r.Context(), "user", user)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
} */
