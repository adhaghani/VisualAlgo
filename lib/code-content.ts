export type Language = "java" | "python" | "javascript" | "cpp"

export interface AlgorithmCode {
  id: string
  name: string
  code: Record<Language, string>
}

export const ALGORITHM_CODES: Record<string, AlgorithmCode> = {
  "bubble-sort": {
    id: "bubble-sort",
    name: "Bubble Sort",
    code: {
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
      java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    },
  },
  "insertion-sort": {
    id: "insertion-sort",
    name: "Insertion Sort",
    code: {
      javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
      java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    },
  },
  "merge-sort": {
    id: "merge-sort",
    name: "Merge Sort",
    code: {
      javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      java: `public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    int mid = arr.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
    return merge(left, right);
}

private static int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length];
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result[k++] = left[i++];
        else result[k++] = right[j++];
    }
    while (i < left.length) result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
    return result;
}`,
      cpp: `vector<int> mergeSort(vector<int> arr) {
    if (arr.size() <= 1) return arr;
    int mid = arr.size() / 2;
    vector<int> left = mergeSort(vector<int>(arr.begin(), arr.begin() + mid));
    vector<int> right = mergeSort(vector<int>(arr.begin() + mid, arr.end()));
    return merge(left, right);
}

vector<int> merge(const vector<int>& left, const vector<int>& right) {
    vector<int> result;
    int i = 0, j = 0;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) result.push_back(left[i++]);
        else result.push_back(right[j++]);
    }
    while (i < left.size()) result.push_back(left[i++]);
    while (j < right.size()) result.push_back(right[j++]);
    return result;
}`,
    },
  },
  "quick-sort": {
    id: "quick-sort",
    name: "Quick Sort",
    code: {
      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`,
      cpp: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
    },
  },
  avl: {
    id: "avl",
    name: "AVL Tree",
    code: {
      javascript: `class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() { this.root = null; }

  getHeight(node) { return node ? node.height : 0; }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
    return y;
  }

  insert(node, value) {
    if (!node) return new AVLNode(value);
    if (value < node.value) node.left = this.insert(node.left, value);
    else if (value > node.value) node.right = this.insert(node.right, value);
    else return node;

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    if (balance > 1 && value < node.left.value) return this.rotateRight(node);
    if (balance < -1 && value > node.right.value) return this.rotateLeft(node);
    if (balance > 1 && value > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    return node;
  }
}`,
      python: `class AVLNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def __init__(self):
        self.root = None

    def get_height(self, node):
        return node.height if node else 0

    def get_balance(self, node):
        return self.get_height(node.left) - self.get_height(node.right) if node else 0

    def rotate_right(self, y):
        x = y.left
        T2 = x.right
        x.right = y
        y.left = T2
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
        return x

    def rotate_left(self, x):
        y = x.right
        T2 = y.left
        y.left = x
        x.right = T2
        x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        return y

    def insert(self, node, value):
        if not node:
            return AVLNode(value)
        if value < node.value:
            node.left = self.insert(node.left, value)
        elif value > node.value:
            node.right = self.insert(node.right, value)
        else:
            return node

        node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
        balance = self.get_balance(node)

        if balance > 1 and value < node.left.value:
            return self.rotate_right(node)
        if balance < -1 and value > node.right.value:
            return self.rotate_left(node)
        if balance > 1 and value > node.left.value:
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)
        if balance < -1 and value < node.right.value:
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)
        return node`,
      java: `class AVLNode {
    int value, height;
    AVLNode left, right;

    AVLNode(int value) {
        this.value = value;
        this.height = 1;
    }
}

public class AVLTree {
    private AVLNode root;

    private int getHeight(AVLNode node) {
        return node == null ? 0 : node.height;
    }

    private int getBalance(AVLNode node) {
        return node == null ? 0 : getHeight(node.left) - getHeight(node.right);
    }

    private AVLNode rotateRight(AVLNode y) {
        AVLNode x = y.left;
        AVLNode T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
        x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
        return x;
    }

    private AVLNode rotateLeft(AVLNode x) {
        AVLNode y = x.right;
        AVLNode T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
        y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
        return y;
    }

    public void insert(int value) {
        root = insertRec(root, value);
    }

    private AVLNode insertRec(AVLNode node, int value) {
        if (node == null) return new AVLNode(value);
        if (value < node.value) node.left = insertRec(node.left, value);
        else if (value > node.value) node.right = insertRec(node.right, value);
        else return node;

        node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
        int balance = getBalance(node);

        if (balance > 1 && value < node.left.value) return rotateRight(node);
        if (balance < -1 && value > node.right.value) return rotateLeft(node);
        if (balance > 1 && value > node.left.value) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        if (balance < -1 && value < node.right.value) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        return node;
    }
}`,
      cpp: `struct AVLNode {
    int value, height;
    AVLNode *left, *right;
    AVLNode(int v) : value(v), left(nullptr), right(nullptr), height(1) {}
};

class AVLTree {
    AVLNode* root = nullptr;

    int getHeight(AVLNode* node) {
        return node ? node->height : 0;
    }

    int getBalance(AVLNode* node) {
        return node ? getHeight(node->left) - getHeight(node->right) : 0;
    }

    AVLNode* rotateRight(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;
        x->right = y;
        y->left = T2;
        y->height = 1 + max(getHeight(y->left), getHeight(y->right));
        x->height = 1 + max(getHeight(x->left), getHeight(x->right));
        return x;
    }

    AVLNode* rotateLeft(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* T2 = y->left;
        y->left = x;
        x->right = T2;
        x->height = 1 + max(getHeight(x->left), getHeight(x->right));
        y->height = 1 + max(getHeight(y->left), getHeight(y->right));
        return y;
    }

    AVLNode* insert(AVLNode* node, int value) {
        if (!node) return new AVLNode(value);
        if (value < node->value) node->left = insert(node->left, value);
        else if (value > node->value) node->right = insert(node->right, value);
        else return node;

        node->height = 1 + max(getHeight(node->left), getHeight(node->right));
        int balance = getBalance(node);

        if (balance > 1 && value < node->left->value) return rotateRight(node);
        if (balance < -1 && value > node->right->value) return rotateLeft(node);
        if (balance > 1 && value > node->left->value) {
            node->left = rotateLeft(node->left);
            return rotateRight(node);
        }
        if (balance < -1 && value < node->right->value) {
            node->right = rotateRight(node->right);
            return rotateLeft(node);
        }
        return node;
    }

public:
    void insert(int value) { root = insert(root, value); }
};`,
    },
  },
  "array-list": {
    id: "array-list",
    name: "ArrayList",
    code: {
      javascript: `class ArrayList {
  constructor(capacity = 4) {
    this.array = new Array(capacity);
    this.size = 0;
    this.capacity = capacity;
  }

  add(value) {
    if (this.size === this.capacity) this.resize();
    this.array[this.size++] = value;
  }

  get(index) {
    if (index < 0 || index >= this.size) throw new Error("Index out of bounds");
    return this.array[index];
  }

  removeAt(index) {
    if (index < 0 || index >= this.size) throw new Error("Index out of bounds");
    const value = this.array[index];
    for (let i = index; i < this.size - 1; i++) {
      this.array[i] = this.array[i + 1];
    }
    this.size--;
    return value;
  }

  resize() {
    this.capacity *= 2;
    const newArray = new Array(this.capacity);
    for (let i = 0; i < this.size; i++) newArray[i] = this.array[i];
    this.array = newArray;
  }
}`,
      python: `class ArrayList:
    def __init__(self, capacity=4):
        self.array = [None] * capacity
        self.size = 0
        self.capacity = capacity

    def add(self, value):
        if self.size == self.capacity:
            self._resize()
        self.array[self.size] = value
        self.size += 1

    def get(self, index):
        if index < 0 or index >= self.size:
            raise IndexError("Index out of bounds")
        return self.array[index]

    def remove_at(self, index):
        if index < 0 or index >= self.size:
            raise IndexError("Index out of bounds")
        value = self.array[index]
        for i in range(index, self.size - 1):
            self.array[i] = self.array[i + 1]
        self.size -= 1
        return value

    def _resize(self):
        self.capacity *= 2
        new_array = [None] * self.capacity
        for i in range(self.size):
            new_array[i] = self.array[i]
        self.array = new_array`,
      java: `public class ArrayList<T> {
    private T[] array;
    private int size;
    private int capacity;

    @SuppressWarnings("unchecked")
    public ArrayList(int capacity) {
        this.capacity = capacity;
        this.array = (T[]) new Object[capacity];
        this.size = 0;
    }

    public void add(T value) {
        if (size == capacity) resize();
        array[size++] = value;
    }

    public T get(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
        return array[index];
    }

    public T removeAt(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
        T value = array[index];
        for (int i = index; i < size - 1; i++) {
            array[i] = array[i + 1];
        }
        size--;
        return value;
    }

    @SuppressWarnings("unchecked")
    private void resize() {
        capacity *= 2;
        T[] newArray = (T[]) new Object[capacity];
        System.arraycopy(array, 0, newArray, 0, size);
        array = newArray;
    }
}`,
      cpp: `template <typename T>
class ArrayList {
    T* array;
    int size;
    int capacity;

    void resize() {
        capacity *= 2;
        T* newArray = new T[capacity];
        for (int i = 0; i < size; i++) newArray[i] = array[i];
        delete[] array;
        array = newArray;
    }

public:
    ArrayList(int capacity = 4) : size(0), capacity(capacity) {
        array = new T[capacity];
    }

    ~ArrayList() { delete[] array; }

    void add(T value) {
        if (size == capacity) resize();
        array[size++] = value;
    }

    T get(int index) {
        if (index < 0 || index >= size) throw std::out_of_range("Index out of bounds");
        return array[index];
    }

    T removeAt(int index) {
        if (index < 0 || index >= size) throw std::out_of_range("Index out of bounds");
        T value = array[index];
        for (int i = index; i < size - 1; i++) array[i] = array[i + 1];
        size--;
        return value;
    }

    int getSize() const { return size; }
};`,
    },
  },
  "linked-list": {
    id: "linked-list",
    name: "Linked List",
    code: {
      javascript: `class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  append(value) {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) current = current.next;
      current.next = node;
    }
    this.size++;
  }

  prepend(value) {
    const node = new ListNode(value);
    node.next = this.head;
    this.head = node;
    this.size++;
  }

  remove(value) {
    if (!this.head) return;
    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return;
    }
    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }
    if (current.next) {
      current.next = current.next.next;
      this.size--;
    }
  }
}`,
      python: `class ListNode:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0

    def append(self, value):
        node = ListNode(value)
        if not self.head:
            self.head = node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = node
        self.size += 1

    def prepend(self, value):
        node = ListNode(value)
        node.next = self.head
        self.head = node
        self.size += 1

    def remove(self, value):
        if not self.head:
            return
        if self.head.value == value:
            self.head = self.head.next
            self.size -= 1
            return
        current = self.head
        while current.next and current.next.value != value:
            current = current.next
        if current.next:
            current.next = current.next.next
            self.size -= 1`,
      java: `class ListNode<T> {
    T value;
    ListNode<T> next;

    ListNode(T value) {
        this.value = value;
        this.next = null;
    }
}

public class LinkedList<T> {
    private ListNode<T> head;
    private int size;

    public void append(T value) {
        ListNode<T> node = new ListNode<>(value);
        if (head == null) {
            head = node;
        } else {
            ListNode<T> current = head;
            while (current.next != null) current = current.next;
            current.next = node;
        }
        size++;
    }

    public void prepend(T value) {
        ListNode<T> node = new ListNode<>(value);
        node.next = head;
        head = node;
        size++;
    }

    public void remove(T value) {
        if (head == null) return;
        if (head.value.equals(value)) {
            head = head.next;
            size--;
            return;
        }
        ListNode<T> current = head;
        while (current.next != null && !current.next.value.equals(value)) {
            current = current.next;
        }
        if (current.next != null) {
            current.next = current.next.next;
            size--;
        }
    }
}`,
      cpp: `template <typename T>
struct ListNode {
    T value;
    ListNode* next;
    ListNode(T v) : value(v), next(nullptr) {}
};

template <typename T>
class LinkedList {
    ListNode<T>* head;
    int size;

public:
    LinkedList() : head(nullptr), size(0) {}

    ~LinkedList() {
        ListNode<T>* current = head;
        while (current) {
            ListNode<T>* next = current->next;
            delete current;
            current = next;
        }
    }

    void append(T value) {
        ListNode<T>* node = new ListNode<T>(value);
        if (!head) { head = node; }
        else {
            ListNode<T>* current = head;
            while (current->next) current = current->next;
            current->next = node;
        }
        size++;
    }

    void prepend(T value) {
        ListNode<T>* node = new ListNode<T>(value);
        node->next = head;
        head = node;
        size++;
    }

    void remove(T value) {
        if (!head) return;
        if (head->value == value) {
            ListNode<T>* temp = head;
            head = head->next;
            delete temp;
            size--;
            return;
        }
        ListNode<T>* current = head;
        while (current->next && current->next->value != value) current = current->next;
        if (current->next) {
            ListNode<T>* temp = current->next;
            current->next = current->next->next;
            delete temp;
            size--;
        }
    }
};`,
    },
  },
  stack: {
    id: "stack",
    name: "Stack",
    code: {
      javascript: `class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    if (this.isEmpty()) throw new Error("Stack underflow");
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) throw new Error("Stack is empty");
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}`,
      python: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, value):
        self.items.append(value)

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack underflow")
        return self.items.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)`,
      java: `import java.util.ArrayList;
import java.util.List;

public class Stack<T> {
    private List<T> items;

    public Stack() {
        this.items = new ArrayList<>();
    }

    public void push(T value) {
        items.add(value);
    }

    public T pop() {
        if (isEmpty()) throw new RuntimeException("Stack underflow");
        return items.remove(items.size() - 1);
    }

    public T peek() {
        if (isEmpty()) throw new RuntimeException("Stack is empty");
        return items.get(items.size() - 1);
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public int size() {
        return items.size();
    }
}`,
      cpp: `#include <vector>
#include <stdexcept>

template <typename T>
class Stack {
    std::vector<T> items;

public:
    void push(T value) {
        items.push_back(value);
    }

    T pop() {
        if (isEmpty()) throw std::runtime_error("Stack underflow");
        T value = items.back();
        items.pop_back();
        return value;
    }

    T peek() {
        if (isEmpty()) throw std::runtime_error("Stack is empty");
        return items.back();
    }

    bool isEmpty() const {
        return items.empty();
    }

    int size() const {
        return items.size();
    }
};`,
    },
  },
  queue: {
    id: "queue",
    name: "Queue",
    code: {
      javascript: `class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    this.items.push(value);
  }

  dequeue() {
    if (this.isEmpty()) throw new Error("Queue underflow");
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) throw new Error("Queue is empty");
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}`,
      python: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, value):
        self.items.append(value)

    def dequeue(self):
        if self.is_empty():
            raise IndexError("Queue underflow")
        return self.items.popleft()

    def front(self):
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[0]

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)`,
      java: `import java.util.LinkedList;
import java.util.Queue;

public class MyQueue<T> {
    private Queue<T> items;

    public MyQueue() {
        this.items = new LinkedList<>();
    }

    public void enqueue(T value) {
        items.add(value);
    }

    public T dequeue() {
        if (isEmpty()) throw new RuntimeException("Queue underflow");
        return items.poll();
    }

    public T front() {
        if (isEmpty()) throw new RuntimeException("Queue is empty");
        return items.peek();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public int size() {
        return items.size();
    }
}`,
      cpp: `#include <queue>
#include <stdexcept>

template <typename T>
class MyQueue {
    std::queue<T> items;

public:
    void enqueue(T value) {
        items.push(value);
    }

    T dequeue() {
        if (isEmpty()) throw std::runtime_error("Queue underflow");
        T value = items.front();
        items.pop();
        return value;
    }

    T front() {
        if (isEmpty()) throw std::runtime_error("Queue is empty");
        return items.front();
    }

    bool isEmpty() const {
        return items.empty();
    }

    int size() const {
        return items.size();
    }
};`,
    },
  },
  "hash-table": {
    id: "hash-table",
    name: "Hash Table",
    code: {
      javascript: `class HashTable {
  constructor(size = 16) {
    this.size = size;
    this.buckets = Array.from({ length: size }, () => []);
    this.count = 0;
  }

  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  set(key, value) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const existing = bucket.find(([k]) => k === key);
    if (existing) {
      existing[1] = value;
    } else {
      bucket.push([key, value]);
      this.count++;
    }
  }

  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const entry = bucket.find(([k]) => k === key);
    return entry ? entry[1] : undefined;
  }

  remove(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const idx = bucket.findIndex(([k]) => k === key);
    if (idx !== -1) {
      bucket.splice(idx, 1);
      this.count--;
    }
  }
}`,
      python: `class HashTable:
    def __init__(self, size=16):
        self.size = size
        self.buckets = [[] for _ in range(size)]
        self.count = 0

    def _hash(self, key):
        hash_val = 0
        for char in str(key):
            hash_val = (hash_val * 31 + ord(char)) % self.size
        return hash_val

    def set(self, key, value):
        index = self._hash(key)
        bucket = self.buckets[index]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))
        self.count += 1

    def get(self, key):
        index = self._hash(key)
        bucket = self.buckets[index]
        for k, v in bucket:
            if k == key:
                return v
        return None

    def remove(self, key):
        index = self._hash(key)
        bucket = self.buckets[index]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket.pop(i)
                self.count -= 1
                return`,
      java: `import java.util.LinkedList;
import java.util.Map;
import java.util.AbstractMap;

public class HashTable<K, V> {
    private LinkedList<Map.Entry<K, V>>[] buckets;
    private int size;
    private int count;

    @SuppressWarnings("unchecked")
    public HashTable(int size) {
        this.size = size;
        this.buckets = new LinkedList[size];
        for (int i = 0; i < size; i++) buckets[i] = new LinkedList<>();
    }

    private int hash(K key) {
        return Math.abs(key.hashCode() % size);
    }

    public void put(K key, V value) {
        int index = hash(key);
        for (Map.Entry<K, V> entry : buckets[index]) {
            if (entry.getKey().equals(key)) {
                entry.setValue(value);
                return;
            }
        }
        buckets[index].add(new AbstractMap.SimpleEntry<>(key, value));
        count++;
    }

    public V get(K key) {
        int index = hash(key);
        for (Map.Entry<K, V> entry : buckets[index]) {
            if (entry.getKey().equals(key)) return entry.getValue();
        }
        return null;
    }

    public void remove(K key) {
        int index = hash(key);
        buckets[index].removeIf(entry -> entry.getKey().equals(key));
        count--;
    }
}`,
      cpp: `#include <vector>
#include <list>
#include <string>
#include <stdexcept>

template <typename K, typename V>
class HashTable {
    struct Entry { K key; V value; };
    std::vector<std::list<Entry>> buckets;
    int size;

    int hash(const K& key) {
        std::hash<K> hasher;
        return hasher(key) % size;
    }

public:
    HashTable(int size = 16) : size(size), buckets(size) {}

    void set(const K& key, const V& value) {
        int index = hash(key);
        for (auto& entry : buckets[index]) {
            if (entry.key == key) {
                entry.value = value;
                return;
            }
        }
        buckets[index].push_back({key, value});
    }

    V get(const K& key) {
        int index = hash(key);
        for (const auto& entry : buckets[index]) {
            if (entry.key == key) return entry.value;
        }
        throw std::runtime_error("Key not found");
    }

    void remove(const K& key) {
        int index = hash(key);
        buckets[index].remove_if([&key](const Entry& e) { return e.key == key; });
    }
};`,
    },
  },
  graph: {
    id: "graph",
    name: "Graph (BFS/DFS)",
    code: {
      javascript: `class Graph {
  constructor() {
    this.adjList = new Map();
  }

  addVertex(v) {
    if (!this.adjList.has(v)) this.adjList.set(v, []);
  }

  addEdge(v1, v2) {
    this.adjList.get(v1).push(v2);
    this.adjList.get(v2).push(v1);
  }

  bfs(start) {
    const visited = new Set();
    const queue = [start];
    const result = [];
    visited.add(start);

    while (queue.length > 0) {
      const vertex = queue.shift();
      result.push(vertex);
      for (const neighbor of this.adjList.get(vertex)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return result;
  }

  dfs(start) {
    const visited = new Set();
    const result = [];
    const stack = [start];

    while (stack.length > 0) {
      const vertex = stack.pop();
      if (!visited.has(vertex)) {
        visited.add(vertex);
        result.push(vertex);
        for (const neighbor of this.adjList.get(vertex)) {
          if (!visited.has(neighbor)) stack.push(neighbor);
        }
      }
    }
    return result;
  }
}`,
      python: `from collections import deque

class Graph:
    def __init__(self):
        self.adj_list = {}

    def add_vertex(self, v):
        if v not in self.adj_list:
            self.adj_list[v] = []

    def add_edge(self, v1, v2):
        self.adj_list[v1].append(v2)
        self.adj_list[v2].append(v1)

    def bfs(self, start):
        visited = set()
        queue = deque([start])
        result = []
        visited.add(start)

        while queue:
            vertex = queue.popleft()
            result.append(vertex)
            for neighbor in self.adj_list[vertex]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        return result

    def dfs(self, start):
        visited = set()
        stack = [start]
        result = []

        while stack:
            vertex = stack.pop()
            if vertex not in visited:
                visited.add(vertex)
                result.append(vertex)
                for neighbor in self.adj_list[vertex]:
                    if neighbor not in visited:
                        stack.append(neighbor)
        return result`,
      java: `import java.util.*;

public class Graph {
    private Map<String, List<String>> adjList;

    public Graph() {
        this.adjList = new HashMap<>();
    }

    public void addVertex(String v) {
        adjList.putIfAbsent(v, new ArrayList<>());
    }

    public void addEdge(String v1, String v2) {
        adjList.get(v1).add(v2);
        adjList.get(v2).add(v1);
    }

    public List<String> bfs(String start) {
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        List<String> result = new ArrayList<>();

        visited.add(start);
        queue.offer(start);

        while (!queue.isEmpty()) {
            String vertex = queue.poll();
            result.add(vertex);
            for (String neighbor : adjList.get(vertex)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
        return result;
    }

    public List<String> dfs(String start) {
        Set<String> visited = new HashSet<>();
        Deque<String> stack = new ArrayDeque<>();
        List<String> result = new ArrayList<>();

        stack.push(start);

        while (!stack.isEmpty()) {
            String vertex = stack.pop();
            if (!visited.contains(vertex)) {
                visited.add(vertex);
                result.add(vertex);
                for (String neighbor : adjList.get(vertex)) {
                    if (!visited.contains(neighbor)) stack.push(neighbor);
                }
            }
        }
        return result;
    }
}`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <stack>

class Graph {
    std::unordered_map<std::string, std::vector<std::string>> adjList;

public:
    void addVertex(const std::string& v) {
        if (adjList.find(v) == adjList.end()) adjList[v] = {};
    }

    void addEdge(const std::string& v1, const std::string& v2) {
        adjList[v1].push_back(v2);
        adjList[v2].push_back(v1);
    }

    std::vector<std::string> bfs(const std::string& start) {
        std::unordered_set<std::string> visited;
        std::queue<std::string> queue;
        std::vector<std::string> result;

        visited.insert(start);
        queue.push(start);

        while (!queue.empty()) {
            std::string vertex = queue.front();
            queue.pop();
            result.push_back(vertex);
            for (const auto& neighbor : adjList[vertex]) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        return result;
    }

    std::vector<std::string> dfs(const std::string& start) {
        std::unordered_set<std::string> visited;
        std::stack<std::string> stack;
        std::vector<std::string> result;

        stack.push(start);

        while (!stack.empty()) {
            std::string vertex = stack.top();
            stack.pop();
            if (visited.find(vertex) == visited.end()) {
                visited.insert(vertex);
                result.push_back(vertex);
                for (const auto& neighbor : adjList[vertex]) {
                    if (visited.find(neighbor) == visited.end()) {
                        stack.push(neighbor);
                    }
                }
            }
        }
        return result;
    }
};`,
    },
  },
  dijkstra: {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    code: {
      javascript: `function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const nodes = Object.keys(graph);

  for (const node of nodes) distances[node] = Infinity;
  distances[start] = 0;

  while (true) {
    let current = null;
    let minDist = Infinity;

    for (const node of nodes) {
      if (!visited.has(node) && distances[node] < minDist) {
        current = node;
        minDist = distances[node];
      }
    }

    if (current === null || minDist === Infinity) break;
    visited.add(current);

    for (const [neighbor, weight] of Object.entries(graph[current])) {
      const newDist = distances[current] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
      }
    }
  }

  return distances;
}`,
      python: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        current_dist, current_node = heapq.heappop(pq)

        if current_dist > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))

    return distances`,
      java: `import java.util.*;

public class Dijkstra {
    public static Map<String, Integer> dijkstra(
            Map<String, Map<String, Integer>> graph, String start) {
        Map<String, Integer> distances = new HashMap<>();
        PriorityQueue<Node> pq = new PriorityQueue<>();

        for (String node : graph.keySet()) distances.put(node, Integer.MAX_VALUE);
        distances.put(start, 0);
        pq.add(new Node(start, 0));

        while (!pq.isEmpty()) {
            Node current = pq.poll();

            if (current.dist > distances.get(current.name)) continue;

            for (Map.Entry<String, Integer> edge : graph.get(current.name).entrySet()) {
                int newDist = distances.get(current.name) + edge.getValue();
                if (newDist < distances.get(edge.getKey())) {
                    distances.put(edge.getKey(), newDist);
                    pq.add(new Node(edge.getKey(), newDist));
                }
            }
        }
        return distances;
    }

    static class Node implements Comparable<Node> {
        String name;
        int dist;
        Node(String n, int d) { name = n; dist = d; }
        public int compareTo(Node other) { return Integer.compare(this.dist, other.dist); }
    }
}`,
      cpp: `#include <vector>
#include <queue>
#include <unordered_map>
#include <limits>

using namespace std;

unordered_map<string, int> dijkstra(
    const unordered_map<string, vector<pair<string, int>>>& graph,
    const string& start) {

    unordered_map<string, int> distances;
    for (const auto& [node, _] : graph)
        distances[node] = numeric_limits<int>::max();
    distances[start] = 0;

    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [dist, current] = pq.top();
        pq.pop();

        if (dist > distances[current]) continue;

        for (const auto& [neighbor, weight] : graph.at(current)) {
            int newDist = distances[current] + weight;
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                pq.push({newDist, neighbor});
            }
        }
    }
    return distances;
}`,
    },
  },
}
