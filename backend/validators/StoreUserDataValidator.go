package validators

/*
		StoreUserData est une structure qui permet de valider les données
	 	envoyées par l'utilisateur lors de la création d'un utilisateur
	 	Toutes les options de validations sont dispo ici :
	 	https://pkg.go.dev/github.com/go-playground/validator/v10#section-readme
*/

type StoreUserDataValidator struct {
	Data struct {
		Type       string              `validate:"required,eq=users"`
		Attributes StoreUserAttributes `json:"attributes"`
	} `json:"data"`
}

/*
StoreUserAttributes est une structure qui représente les attributs
du modèle User à valider
*/
type StoreUserAttributes struct {
	FirstName string `validate:"omitempty"`
	LastName  string `validate:"omitempty"`
	Username  string `validate:"required,min=4"`
	Password  string `validate:"required,min=4"`
	Role 	  string `validate:"required,eq=customer|eq=owner|eq=admin"`
}
