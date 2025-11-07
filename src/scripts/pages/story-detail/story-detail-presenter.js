import { storyMapper } from '../../data/api-mapper';

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #apiModel;
  #dbModel;

  constructor(storyId, { view, apiModel, dbModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel;
  }

  async showStoryDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoryDetailMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      const response = await this.#apiModel.getStoryById(this.#storyId);
 
      if (!response.ok) {
        console.error('showStoryDetail: response:', response);
        this.#view.populateStoryDetailError(response.message);
        return;
      }
 
      const story = await storyMapper(response.story);
      console.log(story); // for debugging purpose, remove after checking it
      this.#view.populateStoryDetailAndInitialMap(response.message, story);
    } catch (error) {
      console.error('showStoryDetail: error:', error);
      this.#view.populateStoryDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }


  // async getCommentsList() {
  //   this.#view.showCommentsLoading();
  //   try {
  //     const response = await this.#apiModel.getAllCommentsByStoryId(this.#storyId);
  //     this.#view.populateStoryDetailComments(response.message, response.story);
  //   } catch (error) {
  //     console.error('getCommentsList: error:', error);
  //     this.#view.populateCommentsListError(error.message);
  //   } finally {
  //     this.#view.hideCommentsLoading();
  //   }
  // }

  // async postNewComment({ body }) {
  //   this.#view.showSubmitLoadingButton();
  //   try {
  //     const response = await this.#apiModel.storeNewCommentByStoryId(this.#storyId, { body });

  //     if (!response.ok) {
  //       console.error('postNewComment: response:', response);
  //       this.#view.postNewCommentFailed(response.message);
  //       return;
  //     }

  //     this.#view.postNewCommentSuccessfully(response.message, response.story);
  //   } catch (error) {
  //     console.error('postNewComment: error:', error);
  //     this.#view.postNewCommentFailed(error.message);
  //   } finally {
  //     this.#view.hideSubmitLoadingButton();
  //   }
  // }
  async saveStory() {
    try {
      const report = await this.#apiModel.getStoryById(this.#storyId);
      await this.#dbModel.putStory(report.story);
      this.#view.saveToBookmarkSuccessfully('Success to save to bookmark');
    } catch (error) {
      console.error('saveStory: error:', error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async removeStory() {
    try {
      await this.#dbModel.removeReport(this.#storyId);
      this.#view.removeFromBookmarkSuccessfully('Success to remove from bookmark');
    } catch (error) {
      console.error('removeReport: error:', error);
      this.#view.removeFromBookmarkFailed(error.message);
    }
  }

  async showSaveButton() {
    if (await this.#isStorySaved()) {
      this.#view.renderRemoveButton();
      return;
    }
    // Optionally, render a default state or an error message to the user
    // For example, if you can't determine saved status, maybe just show the save button
    // or a disabled button, or an error state.
    this.#view.renderSaveButton();// Example: fallback to rendering save button
    // or this.#view.renderErrorMessage("Could not load save status.");
  }

  async #isStorySaved() {
    
    return !!(await this.#dbModel.getStoryById(this.#storyId));
  }
}
