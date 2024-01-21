package validators

/*
		StoreUserValidator est une structure qui permet de valider les données
	 	envoyées par l'utilisateur lors de la création d'un utilisateur
	 	Toutes les options de validations sont dispo ici :
	 	https://pkg.go.dev/github.com/go-playground/validator/v10#section-readme
*/
type StoreUserValidator struct {
	FirstName string `validate:"omitempty"`
	LastName  string `validate:"omitempty"`
	Username  string `validate:"required,min=4"`
	Password  string `validate:"required,min=4"`
}
