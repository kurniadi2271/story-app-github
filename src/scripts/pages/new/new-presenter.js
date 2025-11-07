export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewReport({ description, evidenceImages, latitude, longitude }) {
    this.#view.showSubmitLoadingButton();
    try {
        // --- START OF MODIFICATION ---
        const formData = new FormData();
//         formData.append('name', name);
        formData.append('description', description);
        formData.append('lat', latitude);
        formData.append('lon', longitude);

        // Append each image Blob with the same field name
        evidenceImages.forEach((blob, index) => {
            // Give the file a name for the server to process
            formData.append('photo', blob, `evidence-${index}.png`); 
        });

        // Change this line:
        const response = await this.#model.storeNewStory(formData); // PASS FormData
        // from: const response = await this.#model.storeNewReport(formData);
  

      if (!response.ok) {
        console.error('postNewReport: response:', response);
        this.#view.storeFailed(response.message);
        return;
      }
      // No need to wait response
      this.#notifyToAllUser(response.data);
      

      this.#view.storeSuccessfully(response.message, response.story);
    } catch (error) {
      console.error('postNewReport: error:', error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
  async #notifyToAllUser(reportId) {
    try {
      const response = await this.#model.sendReportToAllUserViaNotification(reportId);
      if (!response.ok) {
        console.error('#notifyToAllUser: response:', response);
        return false;
      }
      return true;
    } catch (error) {
      console.error('#notifyToAllUser: error:', error);
      return false;
    }
  }
}
