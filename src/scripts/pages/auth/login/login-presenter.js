export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.getLogin({ email, password });

      if (!response.ok) {
        console.error('getLogin: response:', response);
        this.#view.loginFailed(response.message);
        return;
      }

      // Check if loginResult and token exist in the response
      if (response.loginResult && response.loginResult.token) {
        this.#authModel.putAccessToken(response.loginResult.token);
      } else {
        // Handle the case where loginResult or token is missing in the response
        console.error('getLogin: accessToken not found in response data:', response);
        this.#view.loginFailed('Login successful, but access token was not received.');
        return; // Or handle this scenario appropriately
      }

      this.#view.loginSuccessfully(response.message, response.loginResult);
    } catch (error) {
      console.error('getLogin: error:', error);
      this.#view.loginFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
