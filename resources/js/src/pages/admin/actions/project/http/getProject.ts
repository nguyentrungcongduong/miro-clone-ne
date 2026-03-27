import { ref } from 'vue'
import { makeHttpReq2 } from '../../../../../helper/makeHttpReq';
import { getUserData } from '../../../../../helper/auth';

export interface IProjectList {
  id: number
  name: string
  projectCode: string
  projectLink: string
  userId: number
}

export type ProjectListResponseType = {
  data: Array<IProjectList>
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export function useGetProject() {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const serverData = ref<ProjectListResponseType>({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })

  const userData = getUserData()
  const userId = userData?.user?.userId

  async function getProjects(page = 1) {
    if (!userId) {
      const errorMsg = 'User ID is not available. Please log in again.'
      console.error(errorMsg)
      error.value = new Error(errorMsg)
      return
    }

    try {
      loading.value = true
      error.value = null

      console.log('Fetching projects for user:', userId, 'page:', page)
      const response = await makeHttpReq2<undefined, ProjectListResponseType>(
        `projects?page=${page}&userId=${userId}`,
        'GET'
      )

      console.log('Projects response received:', response)

      if (response && Array.isArray(response.data)) {
        serverData.value = {
          data: response.data,
          current_page: response.current_page || 1,
          last_page: response.last_page || 1,
          per_page: response.per_page || 10,
          total: response.total || 0
        }
      } else {
        // Handle case where response format is not as expected
        console.warn('Unexpected response format:', response)
        serverData.value = {
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects'
      console.error('Error in getProjects:', errorMessage, err)
      error.value = err instanceof Error ? err : new Error(errorMessage)
      serverData.value = {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      }
    } finally {
      loading.value = false
    }
  }

  return {
    getProjects,
    serverData,
    loading,
    error
  }
}




